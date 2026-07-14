"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { prisma } from "@/lib/db/prisma";
import { contactFormSchema, type ContactFormState } from "@/lib/validations/contact";
import { rateLimit } from "@/lib/rate-limit";
import { assertValidFile, classifyMime } from "@/lib/storage/media-service";
import { cloudinaryStorage } from "@/lib/storage/cloudinary";
import { recordAnalyticsEvent } from "@/lib/analytics";

function getResendClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Rate limit by IP — generous enough for a real visitor, tight enough to
  // blunt scripted abuse of the public form (no auth exists to gate this).
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });
  if (!allowed) {
    return { status: "error", message: "Too many submissions — please try again in a few minutes." };
  }

  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    projectType: formData.get("projectType"),
    timeline: formData.get("timeline"),
    budget: formData.get("budget") || undefined,
    message: formData.get("message"),
    company_website: formData.get("company_website"),
  };

  const parsed = contactFormSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
    };
  }

  // Honeypot tripped — pretend success, do nothing.
  if (parsed.data.company_website) {
    return { status: "success" };
  }

  const { name, email, company, projectType, timeline, budget, message } = parsed.data;

  // Attachment: validate, then upload to Cloudinary (never store the raw
  // file locally or attach unvalidated bytes to an outbound email).
  const attachmentFile = formData.get("attachment") as File | null;
  let mediaId: string | null = null;
  let resendAttachment: { filename: string; content: Buffer }[] | undefined;

  if (attachmentFile && attachmentFile.size > 0 && attachmentFile.name !== "undefined") {
    try {
      assertValidFile(attachmentFile);
    } catch (error) {
      return { status: "error", message: error instanceof Error ? error.message : "Invalid attachment." };
    }

    try {
      const { mediaType, resourceType } = classifyMime(attachmentFile.type);
      const buffer = Buffer.from(await attachmentFile.arrayBuffer());
      const uploaded = await cloudinaryStorage.upload(buffer, {
        folder: "parvex/attachments",
        filename: attachmentFile.name,
        resourceType,
      });

      const media = await prisma.media.create({
        data: {
          type: mediaType,
          category: "ATTACHMENT",
          publicId: uploaded.publicId,
          url: uploaded.url,
          filename: attachmentFile.name,
          mimeType: attachmentFile.type,
          width: uploaded.width,
          height: uploaded.height,
          bytes: uploaded.bytes,
        },
      });
      mediaId = media.id;
      resendAttachment = [{ filename: attachmentFile.name, content: buffer }];
    } catch (error) {
      console.error("Contact attachment upload failed:", error);
      return {
        status: "error",
        message: "We couldn't process that attachment — please try again without it, or email us directly.",
      };
    }
  }

  // Persist the enquiry first — this is the source of truth in /admin/messages
  // regardless of whether the notification email succeeds.
  const contactMessage = await prisma.contactMessage.create({
    data: {
      name,
      email,
      company: company || null,
      projectType,
      timeline,
      budget: budget || null,
      message,
      ipAddress: ip !== "unknown" ? ip : null,
      ...(mediaId ? { attachments: { create: { mediaId } } } : {}),
    },
  });

  void recordAnalyticsEvent("CONTACT_ENQUIRY_CREATED", contactMessage.id, { projectType });

  const resend = getResendClient();
  if (!resend) {
    console.error("submitContactForm: RESEND_API_KEY is not configured — see .env.example. Enquiry was saved to the database and is visible in /admin/messages.");
    return { status: "success" };
  }

  try {
    const settings = await prisma.setting.findUnique({ where: { id: "singleton" } });
    const recipient = settings?.contactEmail || settings?.primaryEmail || process.env.CONTACT_FALLBACK_EMAIL || "";
    const fromDomain = recipient.split("@")[1] || "parvex.in";

    if (recipient) {
      await resend.emails.send({
        from: `Parvex Contact <hello@${fromDomain}>`,
        to: recipient,
        replyTo: email,
        subject: `New enquiry — ${projectType} — ${name}`,
        attachments: resendAttachment,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          company ? `Company: ${company}` : null,
          `Project type: ${projectType}`,
          `Estimated Timeline: ${timeline}`,
          budget ? `Budget: ${budget}` : null,
          "",
          `Message:`,
          message,
          "",
          `View in Admin: ${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/admin/messages/${contactMessage.id}`,
        ]
          .filter(Boolean)
          .join("\n"),
      });
    }

    await prisma.contactMessage.update({ where: { id: contactMessage.id }, data: { notificationState: "SENT" } });
    return { status: "success" };
  } catch (error) {
    console.error("submitContactForm: Resend send failed", error);
    await prisma.contactMessage.update({
      where: { id: contactMessage.id },
      data: { notificationState: "FAILED", notificationError: error instanceof Error ? error.message : "Unknown error" },
    });
    // The enquiry is safely saved and visible in /admin/messages even though
    // the email notification failed — don't tell the visitor it was lost.
    return { status: "success" };
  }
}

"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useReveal } from "@/hooks/useReveal";
import { submitContactForm } from "@/app/(public)/contact/actions";
import {
  contactFormSchema,
  PROJECT_TYPES,
  BUDGET_RANGES,
  ESTIMATED_TIMELINES,
  type ContactFormData,
} from "@/lib/validations/contact";

const fieldLabelClasses =
  "text-[11px] font-medium tracking-[0.14em] uppercase text-[#6B6B6B]";

const textInputClasses =
  "w-full bg-transparent border-0 border-b border-[#E8E8E8] pb-3 text-[17px] md:text-[19px] text-[#0A0A0A] tracking-[-0.01em] placeholder:text-[#C0C0C0] focus:outline-none focus:border-[#0A0A0A] transition-colors duration-300";

function PillOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "rounded-full border px-5 py-2.5 text-[13px] font-medium tracking-[-0.01em]",
        "transition-all duration-250 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-2",
        selected
          ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
          : "bg-transparent text-[#6B6B6B] border-[#E8E8E8] hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
      )}
    >
      {label}
    </button>
  );
}

export function ContactForm() {
  const revealRef = useReveal<HTMLDivElement>({ threshold: 0.08 });
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      projectType: "",
      timeline: "",
      message: "",
      company_website: "",
    },
  });

  const projectType = watch("projectType");
  const budget = watch("budget");
  const timeline = watch("timeline");

  const validateAndSetFile = (file: File) => {
    setAttachmentError(null);
    if (file.size > 10 * 1024 * 1024) {
      setAttachmentError("The attached file exceeds the maximum 10 MB size limit.");
      return;
    }
    const fileName = file.name.toLowerCase();
    const allowedExtensions = [".pdf", ".docx", ".zip", ".png", ".jpg", ".jpeg"];
    const isValid = allowedExtensions.some(ext => fileName.endsWith(ext));
    if (!isValid) {
      setAttachmentError("Unsupported file format. Please upload PDF, DOCX, ZIP, PNG, JPG, or JPEG.");
      return;
    }
    setAttachment(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const onSubmit = (data: ContactFormData) => {
    setServerError(null);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    if (attachment) {
      formData.append("attachment", attachment);
    }

    startTransition(async () => {
      const result = await submitContactForm({ status: "idle" }, formData);
      if (result.status === "success") {
        setSubmitted(true);
        setAttachment(null);
        reset();
      } else if (result.status === "error") {
        setServerError(result.message);
      }
    });
  };

  if (submitted) {
    return (
      <section className="py-24 md:py-32 bg-white" aria-live="polite">
        <Container>
          <div
            data-reveal
            data-revealed="true"
            data-reveal-type="scale"
            className="flex flex-col items-center text-center gap-6 max-w-[520px] mx-auto py-16"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#0A0A0A]">
              <Check size={22} className="text-white" strokeWidth={2.5} />
            </div>
            <h2 className="font-semibold tracking-[-0.03em] text-2xl md:text-[28px] text-[#0A0A0A]">
              Message sent.
            </h2>
            <p className="text-[15px] text-[#6B6B6B] leading-[1.7]">
              Thanks for reaching out — we read every message ourselves and
              reply within 24 hours.
            </p>
            <Button
              variant="secondary"
              size="md"
              className="mt-2 btn-interactive"
              onClick={() => setSubmitted(false)}
            >
              Send another message
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-4 md:py-8 bg-white" aria-labelledby="contact-form-heading">
      <Container>
        <div
          ref={revealRef}
          data-reveal
          data-reveal-type="fade"
          className="max-w-[720px]"
        >
          <h2 id="contact-form-heading" className="sr-only">
            Send us a message
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-12 md:gap-14"
          >
            {/* Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
              <div className="flex flex-col gap-3">
                <label htmlFor="name" className={fieldLabelClasses}>
                  Your name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jordan Rivera"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={textInputClasses}
                  {...register("name")}
                />
                {errors.name && (
                  <p id="name-error" className="text-[13px] text-[#B3261E]">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="email" className={fieldLabelClasses}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="jordan@company.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={textInputClasses}
                  {...register("email")}
                />
                {errors.email && (
                  <p id="email-error" className="text-[13px] text-[#B3261E]">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-3">
              <label htmlFor="company" className={fieldLabelClasses}>
                Company <span className="normal-case text-[#C0C0C0]">(optional)</span>
              </label>
              <input
                id="company"
                type="text"
                autoComplete="organization"
                placeholder="Acme Inc."
                className={textInputClasses}
                {...register("company")}
              />
            </div>

            {/* Project Type */}
            <div className="flex flex-col gap-4">
              <span className={fieldLabelClasses}>What are you building?</span>
              <div className="flex flex-wrap gap-2.5" role="group" aria-label="Project type">
                {PROJECT_TYPES.map((type) => (
                  <PillOption
                    key={type}
                    label={type}
                    selected={projectType === type}
                    onClick={() =>
                      setValue("projectType", type, { shouldValidate: true })
                    }
                  />
                ))}
              </div>
              {errors.projectType && (
                <p className="text-[13px] text-[#B3261E]">
                  {errors.projectType.message}
                </p>
              )}
            </div>

            {/* Timeline */}
            <div className="flex flex-col gap-4">
              <span className={fieldLabelClasses}>Estimated Timeline</span>
              <div className="flex flex-wrap gap-2.5" role="group" aria-label="Project timeline">
                {ESTIMATED_TIMELINES.map((time) => (
                  <PillOption
                    key={time}
                    label={time}
                    selected={timeline === time}
                    onClick={() =>
                      setValue("timeline", time, { shouldValidate: true })
                    }
                  />
                ))}
              </div>
              {errors.timeline && (
                <p className="text-[13px] text-[#B3261E]">
                  {errors.timeline.message}
                </p>
              )}
            </div>

            {/* Budget */}
            <div className="flex flex-col gap-4">
              <span className={fieldLabelClasses}>
                Estimated Budget <span className="normal-case text-[#C0C0C0]">(optional)</span>
              </span>
              <div className="flex flex-wrap gap-2.5" role="group" aria-label="Project budget">
                {BUDGET_RANGES.map((range) => (
                  <PillOption
                    key={range}
                    label={range}
                    selected={budget === range}
                    onClick={() =>
                      setValue("budget", budget === range ? undefined : range, {
                        shouldValidate: true,
                      })
                    }
                  />
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-3">
              <label htmlFor="message" className={fieldLabelClasses}>
                Tell us about your project
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="What are you trying to build, and what does success look like?"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
                className={cn(textInputClasses, "resize-none")}
                {...register("message")}
              />
              {errors.message && (
                <p id="message-error" className="text-[13px] text-[#B3261E]">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Attachment Area */}
            <div className="flex flex-col gap-3">
              <span className={fieldLabelClasses}>
                Attachment <span className="normal-case text-[#C0C0C0]">(optional)</span>
              </span>
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={cn(
                  "border border-dashed rounded-[12px] p-6 text-center transition-all duration-300 relative cursor-pointer",
                  dragActive ? "border-[#0A0A0A] bg-[#0A0A0A]/5" : "border-[#E8E8E8] hover:border-[#6B6B6B]",
                  attachment ? "border-solid border-[#0A0A0A]/10 bg-[#F7F7F7]" : ""
                )}
              >
                <input
                  type="file"
                  id="attachment-upload"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.docx,.zip,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                />

                {attachment ? (
                  <div className="flex items-center justify-between gap-4 pointer-events-auto">
                    <div className="flex flex-col items-start text-left min-w-0">
                      <span className="text-[14px] font-medium text-[#0A0A0A] truncate max-w-[260px] sm:max-w-[450px]">
                        {attachment.name}
                      </span>
                      <span className="text-[12px] text-[#6B6B6B]">
                        {formatFileSize(attachment.size)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setAttachment(null);
                      }}
                      className="text-[13px] font-medium text-[#B3261E] hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 pointer-events-none">
                    <p className="text-[14px] text-[#0A0A0A] font-medium">
                      Drag and drop your file here, or <span className="underline">browse</span>
                    </p>
                    <p className="text-[12px] text-[#6B6B6B]">
                      Share a brief, wireframe, reference, or project document. Max 10 MB.
                    </p>
                  </div>
                )}
              </div>
              {attachmentError && (
                <p className="text-[13px] text-[#B3261E]">
                  {attachmentError}
                </p>
              )}
            </div>

            {/* Honeypot — hidden from real visitors */}
            <input type="hidden" {...register("projectType")} value={projectType ?? ""} />
            <input type="hidden" {...register("timeline")} value={timeline ?? ""} />
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] w-px h-px opacity-0"
              value=""
              {...register("company_website")}
            />

            {serverError && (
              <p role="alert" className="text-[14px] text-[#B3261E]">
                {serverError}
              </p>
            )}

            <div className="flex items-center gap-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isPending}
                className="btn-interactive min-w-[180px]"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  <>Send Message →</>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </section>
  );
}

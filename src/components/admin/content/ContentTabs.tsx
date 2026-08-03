"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Field, Input, Textarea, Checkbox } from "@/components/admin/form/Field";
import { updatePageContent } from "@/app/admin/(authenticated)/content/actions";
import type { PageContent } from "@prisma/client";

const TABS = [
  { key: "HOMEPAGE", label: "Homepage" },
  { key: "WORK", label: "Work" },
  { key: "SERVICES", label: "Services" },
  { key: "CONTACT", label: "Contact" },
] as const;

export function ContentTabs({ byPage }: { byPage: Record<string, PageContent> }) {
  const [active, setActive] = useState<(typeof TABS)[number]["key"]>("HOMEPAGE");

  return (
    <div>
      <div className="mb-5 flex gap-1.5 border-b border-[var(--color-border)]">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`border-b-2 px-4 py-2.5 text-sm font-medium ${
              active === tab.key ? "border-[#0a0a0a] text-[#0a0a0a]" : "border-transparent text-[var(--color-gray)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {TABS.map((tab) => (
        <div key={tab.key} className={active === tab.key ? "block" : "hidden"}>
          <PageContentForm page={tab.key} content={byPage[tab.key]} />
        </div>
      ))}
    </div>
  );
}

function PageContentForm({ page, content }: { page: string; content?: PageContent }) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      heroEyebrow: content?.heroEyebrow ?? "",
      heroHeadline: content?.heroHeadline ?? "",
      heroSupportingCopy: content?.heroSupportingCopy ?? "",
      primaryCtaLabel: content?.primaryCtaLabel ?? "",
      primaryCtaLink: content?.primaryCtaLink ?? "",
      selectedWorkHeading: content?.selectedWorkHeading ?? "",
      servicesHeading: content?.servicesHeading ?? "",
      photographyHeading: content?.photographyHeading ?? "",
      finalCtaHeadline: content?.finalCtaHeadline ?? "",
      finalCtaLabel: content?.finalCtaLabel ?? "",
      finalCtaLink: content?.finalCtaLink ?? "",
      metaTitle: content?.metaTitle ?? "",
      metaDescription: content?.metaDescription ?? "",
      canonicalUrl: content?.canonicalUrl ?? "",
      noIndex: content?.noIndex ?? false,
    },
  });

  async function onSubmit(values: Record<string, unknown>) {
    setSaving(true);
    const result = await updatePageContent(page, values);
    setSaving(false);
    if (result.ok) toast.success(result.message);
    else toast.error(result.message);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <section className="rounded-xl border border-[var(--color-border)] bg-white p-5">
          <h2 className="mb-4 font-semibold">Hero</h2>
          <div className="space-y-4">
            <Field label="Eyebrow">
              <Input {...register("heroEyebrow")} />
            </Field>
            <Field label="Headline">
              <Input {...register("heroHeadline")} />
            </Field>
            <Field label="Supporting Copy">
              <Textarea {...register("heroSupportingCopy")} rows={3} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Primary CTA Label">
                <Input {...register("primaryCtaLabel")} />
              </Field>
              <Field label="Primary CTA Link">
                <Input {...register("primaryCtaLink")} />
              </Field>
            </div>
          </div>
        </section>

        {page === "HOMEPAGE" && (
          <section className="rounded-xl border border-[var(--color-border)] bg-white p-5">
            <h2 className="mb-4 font-semibold">Section Headings</h2>
            <div className="space-y-4">
              <Field label="Selected Work Heading">
                <Input {...register("selectedWorkHeading")} />
              </Field>
              <Field label="Services Heading">
                <Input {...register("servicesHeading")} />
              </Field>
              <Field label="Photography Heading">
                <Input {...register("photographyHeading")} />
              </Field>
            </div>
          </section>
        )}

        <section className="rounded-xl border border-[var(--color-border)] bg-white p-5">
          <h2 className="mb-4 font-semibold">Final CTA</h2>
          <div className="space-y-4">
            <Field label="Headline">
              <Input {...register("finalCtaHeadline")} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Label">
                <Input {...register("finalCtaLabel")} />
              </Field>
              <Field label="Link">
                <Input {...register("finalCtaLink")} />
              </Field>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[var(--color-border)] bg-white p-5">
          <h2 className="mb-4 font-semibold">SEO</h2>
          <div className="space-y-4">
            <Field label="Meta Title">
              <Input {...register("metaTitle")} maxLength={70} />
            </Field>
            <Field label="Meta Description">
              <Textarea {...register("metaDescription")} rows={2} maxLength={160} />
            </Field>
            <Field label="Canonical URL">
              <Input {...register("canonicalUrl")} type="url" />
            </Field>
            <Checkbox label="Hide from search engines (noindex)" {...register("noIndex")} />
          </div>
        </section>
      </div>

      <div>
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-[#0a0a0a] py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

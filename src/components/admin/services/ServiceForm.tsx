"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, ImageIcon } from "lucide-react";
import { Field, Input, Textarea, Checkbox } from "@/components/admin/form/Field";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { createService, updateService } from "@/app/admin/(authenticated)/services/actions";
import type { Media, Service } from "@prisma/client";

export function ServiceForm({ service }: { service?: Service & { media: Media | null } }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [media, setMedia] = useState<Media | null>(service?.media ?? null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      slug: service?.slug ?? "",
      number: service?.number ?? "",
      title: service?.title ?? "",
      description: service?.description ?? "",
      longDescription: service?.longDescription ?? "",
      deliverables: (service?.deliverables ?? []).map((d) => ({ value: d })),
      outcome: service?.outcome ?? "",
      order: service?.order ?? 0,
      published: service?.published ?? true,
      metaTitle: service?.metaTitle ?? "",
      metaDescription: service?.metaDescription ?? "",
      keywords: (service?.keywords ?? []).join(", "),
      canonicalUrl: service?.canonicalUrl ?? "",
      noIndex: service?.noIndex ?? false,
    },
  });

  const deliverables = useFieldArray({ control, name: "deliverables" });

  async function onSubmit(values: Record<string, unknown>) {
    setSaving(true);
    const payload = {
      ...values,
      mediaId: media?.id ?? "",
      deliverables: (values.deliverables as { value: string }[]).map((d) => d.value).filter(Boolean),
      keywords: (values.keywords as string)
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
    };

    const result = service ? await updateService(service.id, payload) : await createService(payload);
    setSaving(false);

    if (result.ok) {
      toast.success(result.message);
      if (!service && result.id) router.push(`/admin/services/${result.id}/edit`);
      else router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Section title="Basics">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Number" required hint="e.g. 01">
              <Input {...register("number")} required />
            </Field>
            <Field label="Slug" hint="Controls the public anchor link — changing it may break existing links.">
              <Input {...register("slug")} placeholder="auto-generated" />
            </Field>
          </div>
          <Field label="Title" required>
            <Input {...register("title")} required />
          </Field>
          <Field label="Short Description" required>
            <Textarea {...register("description")} rows={2} required />
          </Field>
          <Field label="Long Description">
            <Textarea {...register("longDescription")} rows={4} />
          </Field>
          <Field label="Outcome">
            <Textarea {...register("outcome")} rows={2} />
          </Field>
        </Section>

        <Section
          title="Deliverables"
          action={
            <button
              type="button"
              onClick={() => deliverables.append({ value: "" })}
              className="flex items-center gap-1 text-sm text-[var(--color-gray)] hover:text-black"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          }
        >
          {deliverables.fields.map((field, i) => (
            <div key={field.id} className="flex gap-2">
              <Input {...register(`deliverables.${i}.value`)} placeholder="Deliverable" />
              <button type="button" onClick={() => deliverables.remove(i)} className="rounded-md p-2 text-red-500 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </Section>

        <Section title="SEO">
          <Field label="Meta Title">
            <Input {...register("metaTitle")} maxLength={70} />
          </Field>
          <Field label="Meta Description">
            <Textarea {...register("metaDescription")} rows={2} maxLength={160} />
          </Field>
          <Field label="Keywords" hint="Comma-separated.">
            <Input {...register("keywords")} />
          </Field>
          <Field label="Canonical URL">
            <Input {...register("canonicalUrl")} type="url" />
          </Field>
          <Checkbox label="Hide from search engines (noindex)" {...register("noIndex")} />
        </Section>
      </div>

      <div className="space-y-6">
        <Section title="Media">
          {media ? (
            <div className="group relative h-32 w-full overflow-hidden rounded-lg border border-[var(--color-border)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={media.url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setMedia(null)}
                className="absolute right-1 top-1 rounded-md bg-white/90 px-2 py-1 text-xs text-red-600 opacity-0 group-hover:opacity-100"
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="flex h-32 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--color-border)] text-sm text-[var(--color-gray)]"
            >
              <ImageIcon className="h-4 w-4" /> Select image
            </button>
          )}
        </Section>

        <Section title="Organization">
          <Field label="Display Order">
            <Input type="number" {...register("order")} />
          </Field>
          <Checkbox label="Published" {...register("published")} />
        </Section>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-[#0a0a0a] py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Saving…" : service ? "Save Changes" : "Create Service"}
        </button>
      </div>

      <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} category="SERVICE" onSelect={setMedia} />
    </form>
  );
}

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
        {action}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

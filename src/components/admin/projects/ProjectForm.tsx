"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, ImageIcon } from "lucide-react";
import { Field, Input, Textarea, Select, Checkbox } from "@/components/admin/form/Field";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { createProject, updateProject, type ProjectFormValues } from "@/app/admin/(authenticated)/projects/actions";
import type { Media, Project, ProjectGalleryImage, ProjectResult, ProjectTechnology } from "@prisma/client";

type ProjectWithRelations = Project & {
  coverImage: Media | null;
  thumbnail: Media | null;
  technology: ProjectTechnology[];
  gallery: (ProjectGalleryImage & { media: Media })[];
  results: ProjectResult[];
};

export function ProjectForm({
  project,
  serviceOptions,
}: {
  project?: ProjectWithRelations;
  serviceOptions: string[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [coverImage, setCoverImage] = useState<Media | null>(project?.coverImage ?? null);
  const [thumbnail, setThumbnail] = useState<Media | null>(project?.thumbnail ?? null);
  const [pickerTarget, setPickerTarget] = useState<"cover" | "thumbnail" | "gallery" | null>(null);

  const { register, control, handleSubmit, watch, setValue } = useForm<
    Omit<ProjectFormValues, "coverImageId" | "thumbnailId" | "gallery"> & {
      gallery: { mediaId: string; aspect: "landscape" | "portrait" | "square"; media?: Media }[];
    }
  >({
    defaultValues: {
      title: project?.title ?? "",
      slug: project?.slug ?? "",
      category: project?.category ?? "",
      year: project?.year ?? new Date().getFullYear().toString(),
      clientType: project?.clientType ?? "CLIENT",
      clientName: project?.clientName ?? "",
      deliveryStatus: project?.deliveryStatus ?? "LIVE",
      duration: project?.duration ?? "",
      description: project?.description ?? "",
      videoUrl: project?.videoUrl ?? "",
      services: project?.services ?? [],
      challenge: project?.challenge ?? "",
      solution: project?.solution ?? "",
      research: project?.research ?? "",
      development: project?.development ?? "",
      outcome: project?.outcome ?? "",
      technology: project?.technology.map((t) => ({ name: t.name, category: t.category })) ?? [],
      gallery:
        project?.gallery.map((g) => ({ mediaId: g.mediaId, aspect: g.aspect as "landscape" | "portrait" | "square", media: g.media })) ?? [],
      results: project?.results.map((r) => ({ metric: r.metric, value: r.value, description: r.description })) ?? [],
      featured: project?.featured ?? false,
      displayOrder: project?.displayOrder ?? 0,
      metaTitle: project?.metaTitle ?? "",
      metaDescription: project?.metaDescription ?? "",
      canonicalUrl: project?.canonicalUrl ?? "",
      noIndex: project?.noIndex ?? false,
    },
  });

  const technology = useFieldArray({ control, name: "technology" });
  const results = useFieldArray({ control, name: "results" });
  const gallery = useFieldArray({ control, name: "gallery" });

  const selectedServices = watch("services");

  async function onSubmit(values: Omit<ProjectFormValues, "coverImageId" | "thumbnailId">) {
    setSaving(true);
    const payload = {
      ...values,
      coverImageId: coverImage?.id ?? "",
      thumbnailId: thumbnail?.id ?? "",
      gallery: values.gallery.map(({ mediaId, aspect }) => ({ mediaId, aspect })),
    };

    const result = project ? await updateProject(project.id, payload) : await createProject(payload);

    setSaving(false);
    if (result.ok) {
      toast.success(result.message);
      if (!project && result.id) router.push(`/admin/projects/${result.id}`);
      else router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {/* Basics */}
        <Section title="Basics">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" required>
              <Input {...register("title")} required />
            </Field>
            <Field label="Slug" hint="Leave blank to auto-generate from the title.">
              <Input {...register("slug")} placeholder="auto-generated" />
            </Field>
            <Field label="Category" required>
              <Input {...register("category")} placeholder="e.g. Web Development" required />
            </Field>
            <Field label="Year" required>
              <Input {...register("year")} maxLength={4} required />
            </Field>
            <Field label="Client Type">
              <Select {...register("clientType")}>
                <option value="CLIENT">Client</option>
                <option value="INTERNAL">Internal</option>
              </Select>
            </Field>
            <Field label="Client Name">
              <Input {...register("clientName")} />
            </Field>
            <Field label="Delivery Status">
              <Select {...register("deliveryStatus")}>
                <option value="LIVE">Live</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="CONCEPT">Concept</option>
              </Select>
            </Field>
            <Field label="Duration">
              <Input {...register("duration")} placeholder="e.g. 6 weeks" />
            </Field>
          </div>
          <Field label="Short Description" required>
            <Textarea {...register("description")} rows={3} required />
          </Field>
          <Field label="Video URL" hint="Optional — YouTube or Vimeo link.">
            <Input {...register("videoUrl")} type="url" />
          </Field>
        </Section>

        {/* Case Study */}
        <Section title="Case Study">
          <Field label="Challenge">
            <Textarea {...register("challenge")} rows={3} />
          </Field>
          <Field label="Solution">
            <Textarea {...register("solution")} rows={3} />
          </Field>
          <Field label="Research">
            <Textarea {...register("research")} rows={3} />
          </Field>
          <Field label="Development">
            <Textarea {...register("development")} rows={3} />
          </Field>
          <Field label="Outcome">
            <Textarea {...register("outcome")} rows={3} />
          </Field>
        </Section>

        {/* Technology */}
        <Section
          title="Technology Stack"
          action={
            <button
              type="button"
              onClick={() => technology.append({ name: "", category: "" })}
              className="flex items-center gap-1 text-sm text-[var(--color-gray)] hover:text-black"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          }
        >
          {technology.fields.map((field, i) => (
            <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <Input {...register(`technology.${i}.name`)} placeholder="Name" />
              <Input {...register(`technology.${i}.category`)} placeholder="Category" />
              <button type="button" onClick={() => technology.remove(i)} className="rounded-md p-2 text-red-500 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </Section>

        {/* Results */}
        <Section
          title="Results"
          action={
            <button
              type="button"
              onClick={() => results.append({ metric: "", value: "", description: "" })}
              className="flex items-center gap-1 text-sm text-[var(--color-gray)] hover:text-black"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          }
        >
          {results.fields.map((field, i) => (
            <div key={field.id} className="grid grid-cols-[1fr_1fr_2fr_auto] gap-2">
              <Input {...register(`results.${i}.metric`)} placeholder="Metric" />
              <Input {...register(`results.${i}.value`)} placeholder="Value" />
              <Input {...register(`results.${i}.description`)} placeholder="Description" />
              <button type="button" onClick={() => results.remove(i)} className="rounded-md p-2 text-red-500 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </Section>

        {/* Gallery */}
        <Section
          title="Gallery"
          action={
            <button
              type="button"
              onClick={() => setPickerTarget("gallery")}
              className="flex items-center gap-1 text-sm text-[var(--color-gray)] hover:text-black"
            >
              <Plus className="h-4 w-4" /> Add Image
            </button>
          }
        >
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {gallery.fields.map((field, i) => (
              <div key={field.id} className="group relative aspect-square overflow-hidden rounded-lg border border-[var(--color-border)]">
                {field.media && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={field.media.url} alt="" className="h-full w-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => gallery.remove(i)}
                  className="absolute right-1 top-1 rounded-md bg-white/90 p-1 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-600" />
                </button>
              </div>
            ))}
          </div>
        </Section>

        {/* SEO */}
        <Section title="SEO">
          <Field label="Meta Title" hint="Recommended ≤ 60 characters.">
            <Input {...register("metaTitle")} maxLength={70} />
          </Field>
          <Field label="Meta Description" hint="Recommended ≤ 155 characters.">
            <Textarea {...register("metaDescription")} rows={2} maxLength={160} />
          </Field>
          <Field label="Canonical URL">
            <Input {...register("canonicalUrl")} type="url" />
          </Field>
          <Checkbox label="Hide from search engines (noindex)" {...register("noIndex")} />
        </Section>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Section title="Media">
          <Field label="Cover Image">
            <MediaSlot media={coverImage} onPick={() => setPickerTarget("cover")} onClear={() => setCoverImage(null)} />
          </Field>
          <Field label="Thumbnail">
            <MediaSlot media={thumbnail} onPick={() => setPickerTarget("thumbnail")} onClear={() => setThumbnail(null)} />
          </Field>
        </Section>

        <Section title="Organization">
          <Field label="Services Shown" hint="Select which services this project relates to.">
            <div className="space-y-1.5">
              {serviceOptions.map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedServices?.includes(s)}
                    onChange={(e) => {
                      const current = selectedServices ?? [];
                      const next = e.target.checked ? [...current, s] : current.filter((v) => v !== s);
                      setValue("services", next);
                    }}
                  />
                  {s}
                </label>
              ))}
            </div>
          </Field>
          <Field label="Display Order" hint="Lower numbers appear first.">
            <Input type="number" {...register("displayOrder")} />
          </Field>
          <Checkbox label="Feature on homepage" {...register("featured")} />
        </Section>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-[#0a0a0a] py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Saving…" : project ? "Save Changes" : "Create Draft"}
        </button>
      </div>

      <MediaPicker
        open={pickerTarget !== null}
        onClose={() => setPickerTarget(null)}
        category="PROJECT"
        onSelect={(media) => {
          if (pickerTarget === "cover") setCoverImage(media);
          else if (pickerTarget === "thumbnail") setThumbnail(media);
          else if (pickerTarget === "gallery") gallery.append({ mediaId: media.id, aspect: "landscape", media });
        }}
      />
    </form>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
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

function MediaSlot({
  media,
  onPick,
  onClear,
}: {
  media: Media | null;
  onPick: () => void;
  onClear: () => void;
}) {
  if (!media) {
    return (
      <button
        type="button"
        onClick={onPick}
        className="flex h-32 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--color-border)] text-sm text-[var(--color-gray)] hover:border-neutral-400"
      >
        <ImageIcon className="h-4 w-4" /> Select image
      </button>
    );
  }
  return (
    <div className="group relative h-32 w-full overflow-hidden rounded-lg border border-[var(--color-border)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={media.url} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
        <button type="button" onClick={onPick} className="rounded-md bg-white px-2 py-1 text-xs font-medium">
          Change
        </button>
        <button type="button" onClick={onClear} className="rounded-md bg-white px-2 py-1 text-xs font-medium text-red-600">
          Remove
        </button>
      </div>
    </div>
  );
}

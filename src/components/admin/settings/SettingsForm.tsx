"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Field, Input } from "@/components/admin/form/Field";
import { updateSettings } from "@/app/admin/(authenticated)/settings/actions";
import type { Setting } from "@prisma/client";

export function SettingsForm({ settings }: { settings: Setting | null }) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      companyName: settings?.companyName ?? "Parvex",
      tagline: settings?.tagline ?? "",
      primaryEmail: settings?.primaryEmail ?? "",
      contactEmail: settings?.contactEmail ?? "",
      availabilityStatus: settings?.availabilityStatus ?? "",
      responseTime: settings?.responseTime ?? "",
      linkedin: settings?.linkedin ?? "",
      instagram: settings?.instagram ?? "",
      github: settings?.github ?? "",
    },
  });

  async function onSubmit(values: Record<string, unknown>) {
    setSaving(true);
    const result = await updateSettings(values);
    setSaving(false);
    if (result.ok) toast.success(result.message);
    else toast.error(result.message);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6">
      <section className="rounded-xl border border-[var(--color-border)] bg-white p-5">
        <h2 className="mb-4 font-semibold">Company</h2>
        <div className="space-y-4">
          <Field label="Company Name" required>
            <Input {...register("companyName")} required />
          </Field>
          <Field label="Tagline">
            <Input {...register("tagline")} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Primary Email">
              <Input {...register("primaryEmail")} type="email" />
            </Field>
            <Field label="Contact Form Recipient">
              <Input {...register("contactEmail")} type="email" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Availability Status">
              <Input {...register("availabilityStatus")} placeholder="Available for new projects" />
            </Field>
            <Field label="Response Time">
              <Input {...register("responseTime")} placeholder="Within 24 hours" />
            </Field>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--color-border)] bg-white p-5">
        <h2 className="mb-4 font-semibold">Social Links</h2>
        <div className="space-y-4">
          <Field label="LinkedIn">
            <Input {...register("linkedin")} type="url" />
          </Field>
          <Field label="Instagram">
            <Input {...register("instagram")} type="url" />
          </Field>
          <Field label="GitHub">
            <Input {...register("github")} type="url" />
          </Field>
        </div>
      </section>

      <button type="submit" disabled={saving} className="rounded-lg bg-[#0a0a0a] px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}

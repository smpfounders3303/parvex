"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Field, Input, Checkbox } from "@/components/admin/form/Field";
import { updateAnalyticsConfig } from "@/app/admin/(authenticated)/analytics/actions";
import type { AnalyticsConfig } from "@prisma/client";

export function AnalyticsConfigForm({ config }: { config: AnalyticsConfig | null }) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      googleAnalyticsId: config?.googleAnalyticsId ?? "",
      vercelAnalyticsEnabled: config?.vercelAnalyticsEnabled ?? false,
      microsoftClarityId: config?.microsoftClarityId ?? "",
    },
  });

  async function onSubmit(values: Record<string, unknown>) {
    setSaving(true);
    const result = await updateAnalyticsConfig(values);
    setSaving(false);
    if (result.ok) toast.success(result.message);
    else toast.error(result.message);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
      <Field label="Google Analytics Measurement ID" hint="e.g. G-XXXXXXXXXX">
        <Input {...register("googleAnalyticsId")} placeholder="G-XXXXXXXXXX" />
      </Field>
      <Field label="Microsoft Clarity Project ID">
        <Input {...register("microsoftClarityId")} />
      </Field>
      <Checkbox label="Enable Vercel Analytics" {...register("vercelAnalyticsEnabled")} />
      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-[#0a0a0a] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </form>
  );
}

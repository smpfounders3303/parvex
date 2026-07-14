"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

export function ConfirmButton({
  title,
  description,
  confirmLabel = "Delete",
  action,
  className,
  children,
}: {
  title: string;
  description: string;
  confirmLabel?: string;
  action: () => Promise<{ ok: boolean; message?: string }>;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        toast.success(result.message ?? "Done.");
      } else {
        toast.error(result.message ?? "Something went wrong.");
      }
      setOpen(false);
    });
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <p className="font-semibold">{title}</p>
            <p className="mt-2 text-sm text-[var(--color-gray)]">{description}</p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isPending}
                className="rounded-lg bg-red-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {isPending ? "Working…" : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

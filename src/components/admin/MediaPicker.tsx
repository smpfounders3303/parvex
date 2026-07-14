"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Upload, X, Check } from "lucide-react";
import type { Media, MediaCategory } from "@prisma/client";

export function MediaPicker({
  open,
  onClose,
  onSelect,
  category = "PROJECT",
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (media: Media) => void;
  category?: MediaCategory;
}) {
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: shows a loading state while the media list fetch is in flight
    setLoading(true);
    fetch(`/api/admin/media/list?category=${category}`)
      .then((r) => r.json())
      .then((data) => setItems(data.items ?? []))
      .finally(() => setLoading(false));
  }, [open, category]);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      const res = await fetch("/api/admin/media/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed.");
      setItems((prev) => [data.media, ...prev]);
      toast.success("Uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative flex max-h-[80vh] w-full max-w-3xl flex-col rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <p className="font-semibold">Select Media</p>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-neutral-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-[var(--color-border)] px-5 py-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-gray)]">
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading…" : "Upload new file"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              disabled={uploading}
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
          </label>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <p className="text-sm text-[var(--color-gray)]">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-[var(--color-gray)]">No media yet — upload your first file above.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-[var(--color-border)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt={item.altText ?? ""} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

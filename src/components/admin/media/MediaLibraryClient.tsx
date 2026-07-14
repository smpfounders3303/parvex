"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Upload, Trash2, Pencil } from "lucide-react";
import { EmptyState } from "@/components/admin/EmptyState";
import { ImageIcon } from "lucide-react";
import type { Media, MediaCategory } from "@prisma/client";

const CATEGORIES: { value: MediaCategory | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PROJECT", label: "Projects" },
  { value: "PHOTOGRAPHY", label: "Photography" },
  { value: "SERVICE", label: "Services" },
  { value: "BRAND", label: "Brand" },
  { value: "GENERAL", label: "General" },
];

export function MediaLibraryClient({ initialItems }: { initialItems: Media[] }) {
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState<MediaCategory | "ALL">("ALL");
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<Media | null>(null);

  const visible = filter === "ALL" ? items : items.filter((i) => i.category === filter);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", filter === "ALL" ? "GENERAL" : filter);
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

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Delete failed.");
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed.");
    }
  }

  async function handleSaveAlt(id: string, altText: string) {
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ altText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Update failed.");
      setItems((prev) => prev.map((i) => (i.id === id ? data.media : i)));
      toast.success("Saved.");
      setEditing(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed.");
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setFilter(c.value)}
              className={`rounded-full px-3 py-1.5 text-sm ${
                filter === c.value ? "bg-[#0a0a0a] text-white" : "bg-white text-[var(--color-gray)] border border-[var(--color-border)]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#0a0a0a] px-3.5 py-2 text-sm font-medium text-white">
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading…" : "Upload"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,video/mp4"
            className="hidden"
            disabled={uploading}
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />
        </label>
      </div>

      {visible.length === 0 ? (
        <EmptyState icon={ImageIcon} title="No media" description="Upload images used across projects, services, and photography." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {visible.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-lg border border-[var(--color-border)] bg-white">
              <div className="aspect-square bg-neutral-100">
                {item.type === "IMAGE" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt={item.altText ?? ""} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[var(--color-gray)]">
                    {item.type}
                  </div>
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={() => setEditing(item)} className="rounded-md bg-white/90 p-1.5" title="Edit alt text">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="rounded-md bg-white/90 p-1.5" title="Delete">
                  <Trash2 className="h-3.5 w-3.5 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
            <p className="mb-3 font-semibold">Edit Alt Text</p>
            <textarea
              defaultValue={editing.altText ?? ""}
              id="alt-text-input"
              rows={3}
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none"
              placeholder="Describe this image for accessibility and SEO…"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="rounded-lg px-3.5 py-2 text-sm text-neutral-600 hover:bg-neutral-100">
                Cancel
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("alt-text-input") as HTMLTextAreaElement;
                  handleSaveAlt(editing.id, el.value);
                }}
                className="rounded-lg bg-[#0a0a0a] px-3.5 py-2 text-sm font-medium text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

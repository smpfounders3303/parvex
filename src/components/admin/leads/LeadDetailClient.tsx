"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setLeadStage, addLeadNote } from "@/app/admin/(authenticated)/leads/actions";
import type { LeadNote, LeadStage, User } from "@prisma/client";

const STAGES: LeadStage[] = ["NEW", "QUALIFIED", "DISCUSSION", "PROPOSAL", "WON", "LOST"];

export function LeadDetailClient({
  leadId,
  stage,
  notes,
}: {
  leadId: string;
  stage: LeadStage;
  notes: (LeadNote & { author: User })[];
}) {
  const router = useRouter();
  const [noteBody, setNoteBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleStageChange(next: LeadStage) {
    const result = await setLeadStage(leadId, next);
    if (result.ok) {
      toast.success(result.message);
      router.refresh();
    } else toast.error(result.message);
  }

  async function handleAddNote() {
    setSubmitting(true);
    const result = await addLeadNote(leadId, noteBody);
    setSubmitting(false);
    if (result.ok) {
      setNoteBody("");
      toast.success(result.message);
      router.refresh();
    } else toast.error(result.message);
  }

  return (
    <>
      <div className="rounded-xl border border-[var(--color-border)] bg-white p-6">
        <p className="mb-3 text-sm font-medium">Stage</p>
        <div className="flex flex-wrap gap-1.5">
          {STAGES.map((s) => (
            <button
              key={s}
              onClick={() => handleStageChange(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                stage === s ? "bg-[#0a0a0a] text-white" : "border border-[var(--color-border)] text-[var(--color-gray)]"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-white p-6">
        <p className="mb-3 text-sm font-medium">Notes</p>
        <div className="flex gap-2">
          <textarea
            value={noteBody}
            onChange={(e) => setNoteBody(e.target.value)}
            rows={2}
            placeholder="Add an internal note…"
            className="flex-1 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
          <button
            onClick={handleAddNote}
            disabled={submitting}
            className="rounded-lg bg-[#0a0a0a] px-3.5 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            Add
          </button>
        </div>

        {notes.length > 0 && (
          <ul className="mt-4 space-y-3 border-t border-[var(--color-border)] pt-4">
            {notes.map((note) => (
              <li key={note.id} className="text-sm">
                <p>{note.body}</p>
                <p className="mt-0.5 text-xs text-[var(--color-gray)]">
                  {note.author.name} · {note.createdAt.toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

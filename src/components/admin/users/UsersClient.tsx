"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Field, Input, Select } from "@/components/admin/form/Field";
import { createUser, setUserRole, setUserDisabled } from "@/app/admin/(authenticated)/users/actions";
import type { Role, User } from "@prisma/client";

export function UsersClient({ users }: { users: User[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  async function handleRoleChange(id: string, role: Role) {
    const result = await setUserRole(id, role);
    if (result.ok) {
      toast.success(result.message);
      router.refresh();
    } else toast.error(result.message);
  }

  async function handleDisableToggle(id: string, disabled: boolean) {
    const result = await setUserDisabled(id, !disabled);
    if (result.ok) {
      toast.success(result.message);
      router.refresh();
    } else toast.error(result.message);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 rounded-lg bg-[#0a0a0a] px-3.5 py-2 text-sm font-medium text-white"
        >
          <Plus className="h-4 w-4" /> Add User
        </button>
      </div>

      {showForm && <CreateUserForm onCreated={() => setShowForm(false)} />}

      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-wide text-[var(--color-gray)]">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-[var(--color-border)] last:border-0">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-[var(--color-gray)]">{u.email}</td>
                <td className="px-4 py-3">
                  <select
                    defaultValue={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                    className="rounded-lg border border-[var(--color-border)] px-2 py-1 text-sm"
                  >
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="ADMIN">Admin</option>
                    <option value="EDITOR">Editor</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDisableToggle(u.id, u.disabled)}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      u.disabled ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {u.disabled ? "Disabled" : "Active"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CreateUserForm({ onCreated }: { onCreated: () => void }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: "", email: "", password: "", role: "EDITOR" },
  });

  async function onSubmit(values: Record<string, unknown>) {
    setSaving(true);
    const result = await createUser(values);
    setSaving(false);
    if (result.ok) {
      toast.success(result.message);
      reset();
      onCreated();
      router.refresh();
    } else toast.error(result.message);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-xl border border-[var(--color-border)] bg-white p-5 sm:grid-cols-2">
      <Field label="Name" required>
        <Input {...register("name")} required />
      </Field>
      <Field label="Email" required>
        <Input {...register("email")} type="email" required />
      </Field>
      <Field label="Password" required hint="At least 12 characters.">
        <Input {...register("password")} type="password" minLength={12} required />
      </Field>
      <Field label="Role">
        <Select {...register("role")}>
          <option value="EDITOR">Editor</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </Select>
      </Field>
      <div className="sm:col-span-2">
        <button type="submit" disabled={saving} className="rounded-lg bg-[#0a0a0a] px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
          {saving ? "Creating…" : "Create User"}
        </button>
      </div>
    </form>
  );
}

"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { hashPassword } from "better-auth/crypto";
import { prisma } from "@/lib/db/prisma";
import { requireRole, AuthzError } from "@/lib/auth/authz";
import { recordAudit } from "@/lib/audit";

type ActionResult = { ok: boolean; message?: string };

const createUserSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  password: z.string().min(12, "Password must be at least 12 characters."),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR"]),
});

export async function createUser(raw: unknown): Promise<ActionResult> {
  try {
    const session = await requireRole("SUPER_ADMIN");
    const data = createUserSchema.parse(raw);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return { ok: false, message: "A user with this email already exists." };

    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, role: data.role, emailVerified: true },
    });

    const hashed = await hashPassword(data.password);
    await prisma.account.create({
      data: { userId: user.id, accountId: user.id, providerId: "credential", password: hashed },
    });

    await recordAudit(session, "USER_CREATED", "User", user.id, { role: data.role });
    revalidatePath("/admin/users");
    return { ok: true, message: `${data.name} was added as ${data.role.replace("_", " ").toLowerCase()}.` };
  } catch (error) {
    if (error instanceof AuthzError) return { ok: false, message: error.message };
    if (error instanceof z.ZodError) return { ok: false, message: error.issues[0]?.message ?? "Invalid data." };
    console.error(error);
    return { ok: false, message: "Something went wrong." };
  }
}

export async function setUserRole(id: string, role: "SUPER_ADMIN" | "ADMIN" | "EDITOR"): Promise<ActionResult> {
  try {
    const session = await requireRole("SUPER_ADMIN");
    if (session.user.id === id) return { ok: false, message: "You can't change your own role." };

    await prisma.user.update({ where: { id }, data: { role } });
    await recordAudit(session, "USER_ROLE_CHANGED", "User", id, { role });
    revalidatePath("/admin/users");
    return { ok: true, message: "Role updated." };
  } catch (error) {
    if (error instanceof AuthzError) return { ok: false, message: error.message };
    console.error(error);
    return { ok: false, message: "Something went wrong." };
  }
}

export async function setUserDisabled(id: string, disabled: boolean): Promise<ActionResult> {
  try {
    const session = await requireRole("SUPER_ADMIN");
    if (session.user.id === id) return { ok: false, message: "You can't disable your own account." };

    await prisma.user.update({ where: { id }, data: { disabled } });
    await recordAudit(session, disabled ? "USER_DISABLED" : "USER_ENABLED", "User", id);
    revalidatePath("/admin/users");
    return { ok: true, message: disabled ? "User disabled." : "User re-enabled." };
  } catch (error) {
    if (error instanceof AuthzError) return { ok: false, message: error.message };
    console.error(error);
    return { ok: false, message: "Something went wrong." };
  }
}

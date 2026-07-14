import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, type Session } from "@/lib/auth/auth";

// Centralized authorization. Every protected Server Action and Route Handler
// must call one of these — sidebar visibility is NOT security.
//
// Role hierarchy:
//   SUPER_ADMIN — full access: users, roles, settings, content
//   ADMIN       — business/content management, no protected Super Admin ops
//   EDITOR      — projects, services, media, approved content only

export type Role = "SUPER_ADMIN" | "ADMIN" | "EDITOR";

const ROLE_RANK: Record<Role, number> = {
  EDITOR: 0,
  ADMIN: 1,
  SUPER_ADMIN: 2,
};

export class AuthzError extends Error {
  constructor(message = "You don't have permission to do that.") {
    super(message);
    this.name = "AuthzError";
  }
}

/** Returns the current session, or null. Never throws. Safe for optional UI. */
export async function getSession(): Promise<Session | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session ?? null;
}

/**
 * Requires a signed-in, non-disabled admin user. Redirects to /admin/login
 * when called from a page/layout. Use `requireAdminApi` inside Server
 * Actions / Route Handlers instead, where a redirect throw is undesirable.
 */
export async function requireAdmin(): Promise<Session> {
  const session = await getSession();
  if (!session || session.user.disabled) {
    redirect("/admin/login");
  }
  return session;
}

/** Same as requireAdmin but throws instead of redirecting — for Server Actions. */
export async function requireAdminApi(): Promise<Session> {
  const session = await getSession();
  if (!session || session.user.disabled) {
    throw new AuthzError("Your session has expired. Please sign in again.");
  }
  return session;
}

/** Requires at least `minRole` (using the SUPER_ADMIN > ADMIN > EDITOR hierarchy). */
export async function requireRole(minRole: Role): Promise<Session> {
  const session = await requireAdminApi();
  const userRole = session.user.role as Role;
  if (ROLE_RANK[userRole] < ROLE_RANK[minRole]) {
    throw new AuthzError(
      `This action requires the ${minRole.replace("_", " ").toLowerCase()} role or higher.`
    );
  }
  return session;
}

/** Non-throwing capability check for conditional UI (still re-checked server-side on submit). */
export function can(role: Role, minRole: Role): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minRole];
}

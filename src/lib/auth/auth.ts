import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db/prisma";

// Authentication exists ONLY for /admin. There is no public sign-up flow —
// `emailAndPassword.disableSignUp` blocks self-registration; authorized
// users are created exclusively through /admin/users (SUPER_ADMIN only) or
// the one-time initial SUPER_ADMIN seed. See prisma/seed.ts.

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 12,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "EDITOR",
        input: false, // never settable from the client — role changes go through
                       // the authorized /admin/users Server Action only
      },
      disabled: {
        type: "boolean",
        defaultValue: false,
        input: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh once per day of activity
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  advanced: {
    // Namespaced cookie — makes it obvious in devtools this session is
    // scoped to the Admin, not the public site (the public site has no
    // session concept at all).
    cookiePrefix: "parvex_admin",
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 10,
  },
});

export type Session = typeof auth.$Infer.Session;

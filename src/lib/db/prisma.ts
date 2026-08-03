import "server-only";
import { PrismaClient } from "@prisma/client";

// Reusable server-only Prisma client.
// Prevents repeated PrismaClient instantiation during Next.js dev hot reload
// (each reload re-evaluates this module — without the global cache we'd
// exhaust the Postgres connection pool in seconds).

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

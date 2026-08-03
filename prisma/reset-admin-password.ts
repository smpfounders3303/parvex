/**
 * Reset the initial admin password from .env.
 *
 *   npm run db:reset-admin-password
 *
 * This is intentionally separate from seed.ts because the normal seed is
 * idempotent and avoids clobbering existing admin credentials.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "better-auth/crypto";

const prisma = new PrismaClient();

function loadEnvFile() {
  if (process.env.PARVEX_INITIAL_ADMIN_EMAIL && process.env.PARVEX_INITIAL_ADMIN_PASSWORD) {
    return;
  }

  const envPath = resolve(process.cwd(), ".env");
  const contents = readFileSync(envPath, "utf8");

  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    if (process.env[key]) {
      continue;
    }

    const value = rawValue.startsWith('"') && rawValue.endsWith('"')
      ? rawValue.slice(1, -1)
      : rawValue;
    process.env[key] = value;
  }
}

async function main() {
  loadEnvFile();

  const email = process.env.PARVEX_INITIAL_ADMIN_EMAIL;
  const password = process.env.PARVEX_INITIAL_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Set PARVEX_INITIAL_ADMIN_EMAIL and PARVEX_INITIAL_ADMIN_PASSWORD in .env first.");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error(`No admin user found for ${email}. Run npm run db:seed first.`);
  }

  const hashed = await hashPassword(password);

  const account = await prisma.account.findFirst({
    where: { userId: user.id, providerId: "credential" },
  });

  if (account) {
    await prisma.account.update({
      where: { id: account.id },
      data: { accountId: user.id, password: hashed },
    });
  } else {
    await prisma.account.create({
      data: {
        userId: user.id,
        accountId: user.id,
        providerId: "credential",
        password: hashed,
      },
    });
  }

  await prisma.session.deleteMany({ where: { userId: user.id } });
  await prisma.user.update({
    where: { id: user.id },
    data: {
      role: user.role === "SUPER_ADMIN" ? user.role : "SUPER_ADMIN",
      disabled: false,
      emailVerified: true,
    },
  });

  console.log(`Reset admin password for ${email}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) && slug.length >= 2 && slug.length <= 96;
}

/**
 * Given a desired slug and a checker for existing slugs, returns a unique
 * slug — appending -2, -3, ... only if needed. Never silently overwrites
 * another record.
 */
export async function ensureUniqueSlug(
  desired: string,
  existsCheck: (slug: string) => Promise<boolean>
): Promise<string> {
  const base = slugify(desired);
  let candidate = base;
  let suffix = 2;
  while (await existsCheck(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

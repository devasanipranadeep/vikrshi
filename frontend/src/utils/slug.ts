/**
 * Slug generation utility for Vikrshi Suppliers Pvt Ltd
 * Normalizes text to URL-friendly lowercase slugs.
 */
export function generateSlug(text: string): string {
  if (!text) return '';

  return text
    .toString()
    .normalize('NFD') // decompose combined graphemes
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove invalid characters
    .replace(/[\s_-]+/g, '-') // collapse whitespace and underscores to a single dash
    .replace(/^-+|-+$/g, ''); // strip leading and trailing dashes
}

/**
 * Ensures slug uniqueness by appending a suffix if needed
 */
export function formatUniqueSlug(baseText: string, existingSlugs: string[] = []): string {
  const baseSlug = generateSlug(baseText);
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let counter = 1;
  let candidate = `${baseSlug}-${counter}`;
  while (existingSlugs.includes(candidate)) {
    counter += 1;
    candidate = `${baseSlug}-${counter}`;
  }

  return candidate;
}

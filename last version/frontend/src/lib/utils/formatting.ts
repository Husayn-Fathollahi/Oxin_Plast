/**
 * Date and number formatting utilities.
 * All functions respect the active locale when possible.
 */

/**
 * Formats an ISO date string to a human-readable date.
 * Example: "2026-05-19T10:00:00Z" → "May 19, 2026"
 */
export function formatDate(isoString: string, locale = 'en'): string {
  // Normalize to a valid BCP-47 tag (e.g. 'fa_IR' -> 'fa-IR') and fall back to
  // 'en' for empty/invalid values, since Intl.DateTimeFormat throws a
  // RangeError ("Incorrect locale information provided") on malformed tags.
  const normalized = (locale || 'en').replace(/_/g, '-');
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  try {
    return new Intl.DateTimeFormat(normalized, options).format(new Date(isoString));
  } catch {
    return new Intl.DateTimeFormat('en', options).format(new Date(isoString));
  }
}

/**
 * Truncates a string to `maxLength` characters, appending '…' if cut.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

/**
 * Converts a plain string to a URL-friendly slug.
 * Example: "My Product Name" → "my-product-name"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Common validation helpers used across forms and API layers.
 */

/** Returns true if the string is a valid email address. */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** Returns true if the string is a valid Iranian phone number (10-digit or with +98). */
export function isValidIranianPhone(value: string): boolean {
  return /^(\+98|0)?9[0-9]{9}$/.test(value.replace(/\s/g, ''));
}

/** Returns true if the value is a non-empty, non-whitespace string. */
export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/** Returns true if the string length is within [min, max]. */
export function isLength(value: string, min: number, max: number): boolean {
  const len = value.trim().length;
  return len >= min && len <= max;
}

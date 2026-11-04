/**
 * upload-guard.ts
 *
 * Shared security primitives for all file-upload API routes.
 *
 * Key protections:
 *  1. MIME type allow-list  — only explicitly allowed types pass.
 *  2. Magic-byte validation — file content must match its declared MIME type.
 *     Prevents an attacker from renaming an HTML/JS file as a .jpg.
 *  3. Safe filename generation — extension is derived from the validated MIME
 *     type, never from the user-supplied filename, preventing path-traversal
 *     via crafted filenames like "evil.../../shell.js".
 */

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg', // non-standard alias; some older browsers still report this
  'image/png',
  'image/webp',
] as const;

export type AllowedMime = (typeof ALLOWED_MIME_TYPES)[number];

/** Maps each allowed MIME type to its canonical file extension. */
export const MIME_TO_EXT: Record<AllowedMime, string> = {
  'image/jpeg': 'jpg',
  'image/jpg':  'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
};

/**
 * Validates the first bytes of a buffer against well-known image file
 * signatures (magic bytes).
 *
 * Returns false when:
 *  - the buffer is shorter than the longest required header (12 bytes for WebP)
 *  - the declared MIME type is not in the allow-list
 *  - the byte signature does not match the declared MIME type
 */
export function validateMagicBytes(buf: Buffer, mime: string): boolean {
  // WebP needs 12 bytes; reject anything shorter
  if (buf.length < 12) return false;

  if (mime === 'image/jpeg' || mime === 'image/jpg') {
    // JPEG signature: FF D8 FF
    return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  }

  if (mime === 'image/png') {
    // PNG signature: 89 50 4E 47 0D 0A 1A 0A
    return (
      buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 &&
      buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a
    );
  }

  if (mime === 'image/webp') {
    // WebP signature: RIFF (bytes 0-3) + WEBP (bytes 8-11)
    return (
      buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
      buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
    );
  }

  return false;
}

/**
 * Generates a cryptographically random filename.
 *
 * The extension is derived from the already-validated MIME type — the
 * original filename is never used, preventing path-traversal attacks.
 *
 * Format: "<unix-ms>-<uuid-no-dashes>.<ext>"
 * Example: "1719571234567-a1b2c3d4e5f6....webp"
 */
export function generateSafeFilename(mime: AllowedMime): string {
  const ext = MIME_TO_EXT[mime];
  const id  = crypto.randomUUID().replace(/-/g, '');
  return `${Date.now()}-${id}.${ext}`;
}

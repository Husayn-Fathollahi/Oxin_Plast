'use client';

import { useRef, useState } from 'react';

interface ImageUploadFieldProps {
  /** Current image URL (could be a local /uploads/… path or empty string). */
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  /** API endpoint to POST the file to. Defaults to /api/upload */
  uploadEndpoint?: string;
  /** FormData field name. Defaults to "image" */
  fieldName?: string;
}

/**
 * ImageUploadField — drop-in replacement for a plain "Image URL" text input.
 *
 * - Shows a file picker button.
 * - On selection, immediately POSTs the file to `uploadEndpoint`.
 * - While uploading, shows a spinner and disables interaction.
 * - On success, calls `onChange` with the returned URL and shows a preview.
 * - On error, shows an inline message.
 * - Shows a "Remove image" link when a value is present.
 */
export function ImageUploadField({
  value,
  onChange,
  disabled = false,
  uploadEndpoint = '/api/upload',
  fieldName = 'image',
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const isDisabled = disabled || uploading;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!inputRef.current) inputRef.current = e.target;
    // Reset input so the same file can be re-selected after removal
    e.target.value = '';

    if (!file) return;
    setUploadError('');
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append(fieldName, file);

      const res = await fetch(uploadEndpoint, { method: 'POST', body: fd });
      const json = await res.json();

      if (!res.ok) {
        setUploadError(json.error ?? 'Upload failed.');
        return;
      }

      onChange(json.url as string);
    } catch {
      setUploadError('Network error — upload failed.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {/* Preview */}
      {value && (
        <div className="relative w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
          <img
            src={value}
            alt="Cover preview"
            className="max-h-48 w-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            disabled={isDisabled}
            className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white hover:bg-black/80 disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      )}

      {/* Pick button */}
      {!value && (
        <label
          className={[
            'relative flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed',
            'border-gray-300 bg-gray-50 py-8 text-sm text-gray-500',
            'transition-colors hover:border-brand-400 hover:bg-brand-50',
            isDisabled ? 'pointer-events-none opacity-50' : '',
          ].join(' ')}
        >
          {uploading ? (
            <>
              <svg className="h-5 w-5 animate-spin text-brand-600" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Uploading…</span>
            </>
          ) : (
            <>
              <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span>Click to upload cover image</span>
              <span className="text-xs text-gray-400">JPG, PNG, WEBP · max 5 MB</span>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={handleFileChange}
            disabled={isDisabled}
          />
        </label>
      )}

      {/* Replace link when image is set */}
      {value && !uploading && (
        <label className={['relative inline-flex cursor-pointer items-center gap-1 text-xs text-brand-600 hover:underline', isDisabled ? 'pointer-events-none opacity-50' : ''].join(' ')}>
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 013.182 3.182L7.5 19.213l-4.125.459.459-4.125L16.862 3.487z" />
          </svg>
          Replace image
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={handleFileChange}
            disabled={isDisabled}
          />
        </label>
      )}

      {uploadError && (
        <p className="text-xs text-red-600">{uploadError}</p>
      )}
    </div>
  );
}

'use client';

import { use, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  SpecificationsEditor,
  type SpecRow,
  rowsToSpecs,
} from '@/features/products/components/SpecificationsEditor';

// ── Helpers ───────────────────────────────────────────────────────────────────
function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function isValidUrl(val: string): boolean {
  try {
    new URL(val);
    return true;
  } catch {
    return false;
  }
}

type FieldErrors = Record<string, string>;

// ── Component ─────────────────────────────────────────────────────────────────
export default function NewProductPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const router = useRouter();
  const { locale } = use(params);

  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [excerptEn, setExcerptEn] = useState('');
  const [excerptAr, setExcerptAr] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [image, setImage] = useState('');
  const [published, setPublished] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [specRows, setSpecRows] = useState<SpecRow[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'saving'>('idle');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) {
      setSlug(nameToSlug(value));
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    // Reset so the same file can be re-selected and selections accumulate
    e.target.value = '';
  }

  function removeImage(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    // Client-side validation: only validate imageUrl format if the user typed something
    const trimmedImage = image.trim();
    if (trimmedImage !== '' && !isValidUrl(trimmedImage)) {
      setErrors({ image: 'Image URL must be a valid URL (e.g. https://example.com/image.jpg)' });
      return;
    }

    setSubmitting(true);

    try {
      // ── Step 1: Upload files ────────────────────────────────────────────────
      let uploadedUrls: string[] = [];
      if (selectedFiles.length > 0) {
        setUploadStatus('uploading');

        const formData = new FormData();
        for (const file of selectedFiles) {
          formData.append('images', file);
        }

        const uploadRes = await fetch('/api/upload/product-images', {
          method: 'POST',
          body: formData,
        });
        const uploadJson = await uploadRes.json();

        if (!uploadRes.ok) {
          setErrors({ server: uploadJson.error ?? 'Image upload failed.' });
          setUploadStatus('idle');
          return;
        }

        uploadedUrls = uploadJson.urls as string[];
      }

      // ── Step 2: Create the product ─────────────────────────────────────────
      // Only pass the manually entered URL as the legacy `image` field.
      // Uploaded relative paths (/uploads/...) must NOT be sent here because
      // the API validates `image` as a proper absolute URL.
      setUploadStatus('saving');
      const legacyImage = trimmedImage;

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          nameEn,
          nameAr,
          slug,
          excerpt,
          excerptEn,
          excerptAr,
          description,
          descriptionEn,
          descriptionAr,
          image: legacyImage,
          published,
          isFeatured,
          specifications: rowsToSpecs(specRows),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setErrors(json.errors ?? { server: 'Something went wrong.' });
        return;
      }

      const productId: string = json.data.id;

      // ── Step 3: Save ProductImage records ──────────────────────────────────
      if (uploadedUrls.length > 0) {
        const imgRes = await fetch('/api/products/images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, urls: uploadedUrls }),
        });
        const imgJson = await imgRes.json();

        if (!imgRes.ok) {
          // Product was created; warn but still navigate
          console.error('Failed to save product images');
          setErrors({ server: `Product saved but image records failed: ${imgJson.error ?? 'unknown error'}` });
          return;
        }
      }

      router.push(`/${locale}/admin/products`);
      router.refresh();
    } catch (err) {
      console.error('Failed to create product:', err);
      setErrors({ server: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
      setUploadStatus('idle');
    }
  }

  // ── Derived UI state ────────────────────────────────────────────────────────
  const submitLabel =
    !submitting
      ? 'Save Product'
      : uploadStatus === 'uploading'
        ? 'Uploading…'
        : 'Saving…';

  return (
    <div className="mx-auto max-w-2xl">
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">New Product</h1>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
        >
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Global server error */}
        {errors.server && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errors.server}
          </div>
        )}

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Industrial Plastic Valve"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
            disabled={submitting}
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            placeholder="industrial-plastic-valve"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
            disabled={submitting}
          />
          <p className="mt-1 text-xs text-gray-400">
            Auto-generated from name. Must be lowercase and hyphenated.
          </p>
          {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug}</p>}
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
            Excerpt <span className="text-red-500">*</span>
          </label>
          <textarea
            id="excerpt"
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A brief summary shown in product listings…"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50 resize-none"
            disabled={submitting}
          />
          {errors.excerpt && <p className="mt-1 text-xs text-red-600">{errors.excerpt}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            rows={8}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Full product description…"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50 resize-y"
            disabled={submitting}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description}</p>
          )}
        </div>

        {/* ── English Details ─────────────────────────────────────────────── */}
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 space-y-4">
          <p className="text-sm font-semibold text-blue-800">
            🇬🇧 English Details{' '}
            <span className="font-normal text-blue-500">(optional)</span>
          </p>

          {/* Name EN */}
          <div>
            <label htmlFor="nameEn" className="block text-sm font-medium text-gray-700 mb-1">
              Name (English)
            </label>
            <input
              id="nameEn"
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="Industrial Plastic Valve"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
              disabled={submitting}
            />
            {errors.nameEn && <p className="mt-1 text-xs text-red-600">{errors.nameEn}</p>}
          </div>

          {/* Excerpt EN */}
          <div>
            <label htmlFor="excerptEn" className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt (English)
            </label>
            <textarea
              id="excerptEn"
              rows={2}
              value={excerptEn}
              onChange={(e) => setExcerptEn(e.target.value)}
              placeholder="A brief English summary shown in product listings…"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50 resize-none"
              disabled={submitting}
            />
            {errors.excerptEn && <p className="mt-1 text-xs text-red-600">{errors.excerptEn}</p>}
          </div>

          {/* Description EN */}
          <div>
            <label htmlFor="descriptionEn" className="block text-sm font-medium text-gray-700 mb-1">
              Description (English)
            </label>
            <textarea
              id="descriptionEn"
              rows={6}
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              placeholder="Full English product description…"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50 resize-y"
              disabled={submitting}
            />
            {errors.descriptionEn && <p className="mt-1 text-xs text-red-600">{errors.descriptionEn}</p>}
          </div>
        </div>

        {/* ── Arabic Details ─────────────────────────────────────────────── */}
        <div className="rounded-lg border border-green-100 bg-green-50 p-4 space-y-4">
          <p className="text-sm font-semibold text-green-800">
            🇸🇦 Arabic Details{' '}
            <span className="font-normal text-green-500">(optional)</span>
          </p>

          {/* Name AR */}
          <div>
            <label htmlFor="nameAr" className="block text-sm font-medium text-gray-700 mb-1">
              Name (Arabic)
            </label>
            <input
              id="nameAr"
              type="text"
              dir="rtl"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder="اسم المنتج بالعربية"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
              disabled={submitting}
            />
          </div>

          {/* Excerpt AR */}
          <div>
            <label htmlFor="excerptAr" className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt (Arabic)
            </label>
            <textarea
              id="excerptAr"
              rows={2}
              dir="rtl"
              value={excerptAr}
              onChange={(e) => setExcerptAr(e.target.value)}
              placeholder="ملخص قصير بالعربية..."
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50 resize-none"
              disabled={submitting}
            />
          </div>

          {/* Description AR */}
          <div>
            <label htmlFor="descriptionAr" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Arabic)
            </label>
            <textarea
              id="descriptionAr"
              rows={6}
              dir="rtl"
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              placeholder="وصف المنتج الكامل بالعربية..."
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50 resize-y"
              disabled={submitting}
            />
          </div>
        </div>

        {/* ── Technical Specifications ── */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
          <p className="text-sm font-semibold text-gray-700">
            Technical Specifications{' '}
            <span className="font-normal text-gray-400">(optional)</span>
          </p>
          <SpecificationsEditor
            rows={specRows}
            onChange={setSpecRows}
            disabled={submitting}
          />
        </div>

        {/* Image URL (optional legacy field) */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL{' '}
            <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            id="image"
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
            disabled={submitting}
          />
          <p className="mt-1 text-xs text-gray-400">Paste an absolute URL, or leave empty and upload files below.</p>
          {errors.image && <p className="mt-1 text-xs text-red-600">{errors.image}</p>}
        </div>

        {/* Multi-image upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Images{' '}
            <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            disabled={submitting}
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100 disabled:opacity-50"
          />
          <p className="mt-1 text-xs text-gray-400">
            JPG, PNG, WebP · max 5 MB each · multiple files allowed. First image becomes primary.
          </p>
          {uploadStatus === 'uploading' && (
            <p className="mt-1 text-xs text-blue-600 animate-pulse">Uploading images…</p>
          )}
          {/* Preview grid */}
          {selectedFiles.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {selectedFiles.map((file, index) => (
                <div key={`${file.name}-${index}`} className="relative aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-full w-full rounded-lg object-cover border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    disabled={submitting}
                    aria-label={`Remove ${file.name}`}
                    className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-bl rounded-tr-lg bg-red-500 text-white text-xs leading-none hover:bg-red-600 disabled:opacity-50"
                  >
                    ×
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-0 left-0 rounded-br rounded-tl-lg bg-black/50 px-1 py-0.5 text-[10px] text-white">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Published toggle */}
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <button
            id="published"
            type="button"
            role="switch"
            aria-checked={published}
            onClick={() => setPublished((v) => !v)}
            disabled={submitting}
            className={[
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
              'transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
              published ? 'bg-brand-600' : 'bg-gray-300',
              'disabled:opacity-50',
            ].join(' ')}
          >
            <span
              className={[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0',
                'transition duration-200 ease-in-out',
                published ? 'translate-x-5' : 'translate-x-0',
              ].join(' ')}
            />
          </button>
          <label
            htmlFor="published"
            className="text-sm font-medium text-gray-700 cursor-pointer select-none"
          >
            Publish immediately
          </label>
          <span className="ml-auto text-xs text-gray-400">
            {published ? 'Visible to visitors' : 'Saved as draft'}
          </span>
        </div>

        {/* Featured on homepage toggle */}
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <button
            id="isFeatured"
            type="button"
            role="switch"
            aria-checked={isFeatured}
            onClick={() => setIsFeatured((v) => !v)}
            disabled={submitting}
            className={[
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
              'transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
              isFeatured ? 'bg-brand-600' : 'bg-gray-300',
              'disabled:opacity-50',
            ].join(' ')}
          >
            <span
              className={[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0',
                'transition duration-200 ease-in-out',
                isFeatured ? 'translate-x-5' : 'translate-x-0',
              ].join(' ')}
            />
          </button>
          <label
            htmlFor="isFeatured"
            className="text-sm font-medium text-gray-700 cursor-pointer select-none"
          >
            Show on Homepage (Featured) / نمایش در صفحه اصلی (محصول ویژه)
          </label>
          <span className="ml-auto text-xs text-gray-400">
            {isFeatured ? 'Shown in the homepage "Our Products" section' : 'Not featured'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={submitting}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-60"
          >
          {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

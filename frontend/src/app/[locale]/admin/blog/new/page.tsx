'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

type FieldErrors = Record<string, string>;

export default function NewArticlePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const router = useRouter();
  const { locale } = use(params);

  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [excerptEn, setExcerptEn] = useState('');
  const [content, setContent] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [image, setImage] = useState('');
  const [published, setPublished] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(titleToSlug(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, titleEn,
          slug,
          excerpt, excerptEn,
          content, contentEn,
          image: image.trim(),
          published,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrors(json.errors ?? { server: 'Something went wrong.' });
        return;
      }

      router.push(`/${locale}/admin/blog`);
      router.refresh();
    } catch {
      setErrors({ server: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50';

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">New Article</h1>
        <button type="button" onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-700 hover:underline">
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.server && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errors.server}
          </div>
        )}

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input id="title" type="text" value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="My Awesome Article"
            className={inputCls} disabled={submitting} />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <input id="slug" type="text" value={slug}
            onChange={(e) => { setSlugTouched(true); setSlug(e.target.value); }}
            placeholder="my-awesome-article"
            className={`${inputCls} font-mono`} disabled={submitting} />
          <p className="mt-1 text-xs text-gray-400">Auto-generated from title. Must be lowercase and hyphenated.</p>
          {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug}</p>}
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
            Excerpt <span className="text-red-500">*</span>
          </label>
          <textarea id="excerpt" rows={2} value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A short summary shown in article cards…"
            className={`${inputCls} resize-none`} disabled={submitting} />
          {errors.excerpt && <p className="mt-1 text-xs text-red-600">{errors.excerpt}</p>}
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea id="content" rows={12} value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article here…"
            className={`${inputCls} resize-y`} disabled={submitting} />
          {errors.content && <p className="mt-1 text-xs text-red-600">{errors.content}</p>}
        </div>

        {/* ── English Details ── */}
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 space-y-4">
          <p className="text-sm font-semibold text-blue-800">
            🇬🇧 English Details{' '}
            <span className="font-normal text-blue-500">(optional)</span>
          </p>

          <div>
            <label htmlFor="titleEn" className="block text-sm font-medium text-gray-700 mb-1">Title (English)</label>
            <input id="titleEn" type="text" value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="My Awesome Article"
              className={`${inputCls} bg-white`} disabled={submitting} />
          </div>

          <div>
            <label htmlFor="excerptEn" className="block text-sm font-medium text-gray-700 mb-1">Excerpt (English)</label>
            <textarea id="excerptEn" rows={2} value={excerptEn}
              onChange={(e) => setExcerptEn(e.target.value)}
              placeholder="A brief English summary…"
              className={`${inputCls} bg-white resize-none`} disabled={submitting} />
          </div>

          <div>
            <label htmlFor="contentEn" className="block text-sm font-medium text-gray-700 mb-1">Content (English)</label>
            <textarea id="contentEn" rows={10} value={contentEn}
              onChange={(e) => setContentEn(e.target.value)}
              placeholder="Write your article in English here…"
              className={`${inputCls} bg-white resize-y`} disabled={submitting} />
          </div>
        </div>

        {/* Cover image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Image <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <ImageUploadField value={image} onChange={setImage} disabled={submitting} />
          {errors.image && <p className="mt-1 text-xs text-red-600">{errors.image}</p>}
        </div>

        {/* Published toggle */}
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <button id="published" type="button" role="switch" aria-checked={published}
            onClick={() => setPublished((v) => !v)} disabled={submitting}
            className={[
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
              'transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
              published ? 'bg-brand-600' : 'bg-gray-300', 'disabled:opacity-50',
            ].join(' ')}>
            <span className={[
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0',
              'transition duration-200 ease-in-out',
              published ? 'translate-x-5' : 'translate-x-0',
            ].join(' ')} />
          </button>
          <label htmlFor="published" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
            Publish immediately
          </label>
          <span className="ml-auto text-xs text-gray-400">
            {published ? 'Will be visible to visitors' : 'Saved as draft'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={() => router.back()} disabled={submitting}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" disabled={submitting}
            className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-60">
            {submitting ? 'Saving…' : 'Save Article'}
          </button>
        </div>
      </form>
    </div>
  );
}



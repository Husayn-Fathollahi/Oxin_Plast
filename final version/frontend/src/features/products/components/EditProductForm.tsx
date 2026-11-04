// 'use client';

// import { useRef, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import {
//   SpecificationsEditor,
//   type SpecRow,
//   specsToRows,
//   rowsToSpecs,
// } from './SpecificationsEditor';

// function isValidUrl(val: string): boolean {
//   try {
//     new URL(val);
//     return true;
//   } catch {
//     return false;
//   }
// }

// export interface ProductImageData {
//   id: string;
//   url: string;
//   isPrimary: boolean;
//   sortOrder: number;
// }

// export interface EditProductFormProps {
//   id: string;
//   locale: string;
//   initial: {
//     name: string;
//     nameEn: string;
//     nameAr: string;
//     slug: string;
//     excerpt: string;
//     excerptEn: string;
//     excerptAr: string;
//     description: string;
//     descriptionEn: string;
//     descriptionAr: string;
//     image: string;
//     published: boolean;
//     isFeatured: boolean;
//     images: ProductImageData[];
//     specifications: Record<string, string> | null;
//   };
// }

// type FieldErrors = Record<string, string>;

// export function EditProductForm({ id, locale, initial }: EditProductFormProps) {
//   const router = useRouter();

//   const [name, setName] = useState(initial.name);
//   const [nameEn, setNameEn] = useState(initial.nameEn);
//   const [nameAr, setNameAr] = useState(initial.nameAr);
//   const [slug, setSlug] = useState(initial.slug);
//   const [excerpt, setExcerpt] = useState(initial.excerpt);
//   const [excerptEn, setExcerptEn] = useState(initial.excerptEn);
//   const [excerptAr, setExcerptAr] = useState(initial.excerptAr);
//   const [description, setDescription] = useState(initial.description);
//   const [descriptionEn, setDescriptionEn] = useState(initial.descriptionEn);
//   const [descriptionAr, setDescriptionAr] = useState(initial.descriptionAr);
//   const [image, setImage] = useState(initial.image);
//   const [published, setPublished] = useState(initial.published);
//   const [isFeatured, setIsFeatured] = useState(initial.isFeatured);
//   const [existingImages] = useState<ProductImageData[]>(initial.images);
//   const [specRows, setSpecRows] = useState<SpecRow[]>(() => specsToRows(initial.specifications));

//   const [errors, setErrors] = useState<FieldErrors>({});
//   const [submitting, setSubmitting] = useState(false);
//   const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'saving'>('idle');
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
//     if (!e.target.files) return;
//     setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
//     e.target.value = '';
//   }

//   function removeNewImage(index: number) {
//     setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setErrors({});

//     const trimmedImage = image.trim();
//     if (trimmedImage !== '' && !isValidUrl(trimmedImage)) {
//       setErrors({ image: 'Image URL must be a valid URL (e.g. https://example.com/image.jpg)' });
//       return;
//     }

//     setSubmitting(true);

//     try {
//       // ── Step 1: Upload new files ────────────────────────────────────────────
//       let uploadedUrls: string[] = [];
//       if (selectedFiles.length > 0) {
//         setUploadStatus('uploading');
//         const formData = new FormData();
//         for (const file of selectedFiles) formData.append('images', file);

//         const uploadRes = await fetch('/api/upload/product-images', {
//           method: 'POST',
//           body: formData,
//         });
//         const uploadJson = await uploadRes.json();
//         if (!uploadRes.ok) {
//           setErrors({ server: uploadJson.error ?? 'Image upload failed.' });
//           setUploadStatus('idle');
//           return;
//         }
//         uploadedUrls = uploadJson.urls as string[];
//       }

//       // ── Step 2: PATCH product ───────────────────────────────────────────────
//       setUploadStatus('saving');
//       const res = await fetch(`/api/products/${id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name,
//           nameEn,
//           nameAr,
//           slug,
//           excerpt,
//           excerptEn,
//           excerptAr,
//           description,
//           descriptionEn,
//           descriptionAr,
//           image: trimmedImage,
//           published,
//           isFeatured,
//           specifications: rowsToSpecs(specRows),
//         }),
//       });

//       const json = await res.json();
//       if (!res.ok) {
//         setErrors(json.errors ?? { server: 'Something went wrong.' });
//         return;
//       }

//       // ── Step 3: Save new ProductImage records ───────────────────────────────
//       if (uploadedUrls.length > 0) {
//         const nextSortOrder = existingImages.length;
//         const imgRes = await fetch('/api/products/images', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             productId: id,
//             urls: uploadedUrls,
//             startSortOrder: nextSortOrder,
//           }),
//         });
//         if (!imgRes.ok) {
//           const imgJson = await imgRes.json();
//           console.error('Failed to save product images');
//           setErrors({ server: `Product saved but image upload failed: ${imgJson.error ?? 'unknown'}` });
//           return;
//         }
//       }

//       router.push(`/${locale}/admin/products`);
//       router.refresh();
//     } catch (err) {
//       console.error('Failed to edit product:', err);
//       setErrors({ server: 'Network error. Please try again.' });
//     } finally {
//       setSubmitting(false);
//       setUploadStatus('idle');
//     }
//   }

//   const submitLabel = !submitting
//     ? 'Save Changes'
//     : uploadStatus === 'uploading'
//       ? 'Uploading…'
//       : 'Saving…';

//   const inputCls =
//     'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50';
//   const textareaCls = `${inputCls} resize-y`;

//   return (
//     <form onSubmit={handleSubmit} className="space-y-5">
//       {errors.server && (
//         <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//           {errors.server}
//         </div>
//       )}

//       {/* ── Persian fields ── */}
//       <div>
//         <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
//           Name <span className="text-red-500">*</span>
//         </label>
//         <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
//           className={inputCls} disabled={submitting} />
//         {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
//       </div>

//       <div>
//         <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
//           Slug <span className="text-red-500">*</span>
//         </label>
//         <input id="slug" type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
//           className={`${inputCls} font-mono`} disabled={submitting} />
//         <p className="mt-1 text-xs text-gray-400">Lowercase and hyphenated.</p>
//         {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug}</p>}
//       </div>

//       <div>
//         <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
//           Excerpt <span className="text-red-500">*</span>
//         </label>
//         <textarea id="excerpt" rows={2} value={excerpt}
//           onChange={(e) => setExcerpt(e.target.value)}
//           className={`${textareaCls} resize-none`} disabled={submitting} />
//         {errors.excerpt && <p className="mt-1 text-xs text-red-600">{errors.excerpt}</p>}
//       </div>

//       <div>
//         <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//           Description <span className="text-red-500">*</span>
//         </label>
//         <textarea id="description" rows={8} value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className={textareaCls} disabled={submitting} />
//         {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
//       </div>

//       {/* ── English fields ── */}
//       <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 space-y-4">
//         <p className="text-sm font-semibold text-blue-800">
//           🇬🇧 English Details{' '}
//           <span className="font-normal text-blue-500">(optional)</span>
//         </p>

//         <div>
//           <label htmlFor="nameEn" className="block text-sm font-medium text-gray-700 mb-1">
//             Name (English)
//           </label>
//           <input id="nameEn" type="text" value={nameEn}
//             onChange={(e) => setNameEn(e.target.value)}
//             placeholder="Product name in English"
//             className={inputCls} disabled={submitting} />
//         </div>

//         <div>
//           <label htmlFor="excerptEn" className="block text-sm font-medium text-gray-700 mb-1">
//             Excerpt (English)
//           </label>
//           <textarea id="excerptEn" rows={2} value={excerptEn}
//             onChange={(e) => setExcerptEn(e.target.value)}
//             placeholder="Brief English summary…"
//             className={`${textareaCls} resize-none`} disabled={submitting} />
//         </div>

//         <div>
//           <label htmlFor="descriptionEn" className="block text-sm font-medium text-gray-700 mb-1">
//             Description (English)
//           </label>
//           <textarea id="descriptionEn" rows={6} value={descriptionEn}
//             onChange={(e) => setDescriptionEn(e.target.value)}
//             placeholder="Full English product description…"
//             className={textareaCls} disabled={submitting} />
//         </div>
//       </div>

//       {/* ── Arabic fields ── */}
//       <div className="rounded-lg border border-green-100 bg-green-50 p-4 space-y-4">
//         <p className="text-sm font-semibold text-green-800">
//           🇸🇦 Arabic Details{' '}
//           <span className="font-normal text-green-500">(optional)</span>
//         </p>

//         <div>
//           <label htmlFor="nameAr" className="block text-sm font-medium text-gray-700 mb-1">
//             Name (Arabic)
//           </label>
//           <input id="nameAr" type="text" dir="rtl" value={nameAr}
//             onChange={(e) => setNameAr(e.target.value)}
//             placeholder="اسم المنتج بالعربية"
//             className={inputCls} disabled={submitting} />
//         </div>

//         <div>
//           <label htmlFor="excerptAr" className="block text-sm font-medium text-gray-700 mb-1">
//             Excerpt (Arabic)
//           </label>
//           <textarea id="excerptAr" rows={2} dir="rtl" value={excerptAr}
//             onChange={(e) => setExcerptAr(e.target.value)}
//             placeholder="ملخص قصير بالعربية..."
//             className={`${textareaCls} resize-none`} disabled={submitting} />
//         </div>

//         <div>
//           <label htmlFor="descriptionAr" className="block text-sm font-medium text-gray-700 mb-1">
//             Description (Arabic)
//           </label>
//           <textarea id="descriptionAr" rows={6} dir="rtl" value={descriptionAr}
//             onChange={(e) => setDescriptionAr(e.target.value)}
//             placeholder="وصف المنتج الكامل بالعربية..."
//             className={textareaCls} disabled={submitting} />
//         </div>
//       </div>

//       {/* ── Existing images ── */}
//       {existingImages.length > 0 && (
//         <div>
//           <p className="block text-sm font-medium text-gray-700 mb-2">Current Images</p>
//           <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
//             {existingImages.map((img) => (
//               <div key={img.id} className="relative aspect-square">
//                 {/* eslint-disable-next-line @next/next/no-img-element */}
//                 <img src={img.url} alt="" className="h-full w-full rounded-lg object-cover border border-gray-200" />
//                 {img.isPrimary && (
//                   <span className="absolute bottom-0 left-0 rounded-br rounded-tl-lg bg-black/50 px-1 py-0.5 text-[10px] text-white">
//                     Primary
//                   </span>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ── Technical Specifications ── */}
//       <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
//         <p className="text-sm font-semibold text-gray-700">
//           Technical Specifications{' '}
//           <span className="font-normal text-gray-400">(optional)</span>
//         </p>
//         <SpecificationsEditor
//           rows={specRows}
//           onChange={setSpecRows}
//           disabled={submitting}
//         />
//       </div>

//       {/* ── Image URL (legacy) ── */}
//       <div>
//         <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
//           Image URL <span className="font-normal text-gray-400">(optional)</span>
//         </label>
//         <input id="image" type="text" value={image}
//           onChange={(e) => setImage(e.target.value)}
//           placeholder="https://example.com/image.jpg"
//           className={inputCls} disabled={submitting} />
//         <p className="mt-1 text-xs text-gray-400">Paste an absolute URL, or upload new files below.</p>
//         {errors.image && <p className="mt-1 text-xs text-red-600">{errors.image}</p>}
//       </div>

//       {/* ── Add new images ── */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Add Images <span className="font-normal text-gray-400">(optional)</span>
//         </label>
//         <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
//           multiple disabled={submitting} onChange={handleFileChange}
//           className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100 disabled:opacity-50" />
//         <p className="mt-1 text-xs text-gray-400">
//           JPG, PNG, WebP · max 5 MB each · appended to existing images.
//         </p>
//         {uploadStatus === 'uploading' && (
//           <p className="mt-1 text-xs text-blue-600 animate-pulse">Uploading images…</p>
//         )}
//         {selectedFiles.length > 0 && (
//           <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
//             {selectedFiles.map((file, index) => (
//               <div key={`${file.name}-${index}`} className="relative aspect-square">
//                 {/* eslint-disable-next-line @next/next/no-img-element */}
//                 <img src={URL.createObjectURL(file)} alt={file.name}
//                   className="h-full w-full rounded-lg object-cover border border-gray-200" />
//                 <button type="button" onClick={() => removeNewImage(index)} disabled={submitting}
//                   aria-label={`Remove ${file.name}`}
//                   className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-bl rounded-tr-lg bg-red-500 text-white text-xs leading-none hover:bg-red-600 disabled:opacity-50">
//                   ×
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* ── Published toggle ── */}
//       <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
//         <button id="published" type="button" role="switch" aria-checked={published}
//           onClick={() => setPublished((v) => !v)} disabled={submitting}
//           className={[
//             'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
//             'transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
//             published ? 'bg-brand-600' : 'bg-gray-300',
//             'disabled:opacity-50',
//           ].join(' ')}>
//           <span className={[
//             'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0',
//             'transition duration-200 ease-in-out',
//             published ? 'translate-x-5' : 'translate-x-0',
//           ].join(' ')} />
//         </button>
//         <label htmlFor="published" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
//           Published
//         </label>
//         <span className="ml-auto text-xs text-gray-400">
//           {published ? 'Visible to visitors' : 'Saved as draft'}
//         </span>
//       </div>

//       {/* ── Featured on homepage toggle ── */}
//       <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
//         <button id="isFeatured" type="button" role="switch" aria-checked={isFeatured}
//           onClick={() => setIsFeatured((v) => !v)} disabled={submitting}
//           className={[
//             'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
//             'transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
//             isFeatured ? 'bg-brand-600' : 'bg-gray-300',
//             'disabled:opacity-50',
//           ].join(' ')}>
//           <span className={[
//             'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0',
//             'transition duration-200 ease-in-out',
//             isFeatured ? 'translate-x-5' : 'translate-x-0',
//           ].join(' ')} />
//         </button>
//         <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
//           Show on Homepage (Featured) / نمایش در صفحه اصلی (محصول ویژه)
//         </label>
//         <span className="ml-auto text-xs text-gray-400">
//           {isFeatured ? 'Shown in the homepage "Our Products" section' : 'Not featured'}
//         </span>
//       </div>

//       {/* ── Actions ── */}
//       <div className="flex items-center justify-end gap-3 pt-2">
//         <button type="button" onClick={() => router.back()} disabled={submitting}
//           className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50">
//           Cancel
//         </button>
//         <button type="submit" disabled={submitting}
//           className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-60">
//           {submitLabel}
//         </button>
//       </div>
//     </form>
//   );
// }


'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  SpecificationsEditor,
  type SpecRow,
  specsToRows,
  rowsToSpecs,
} from './SpecificationsEditor';

function isValidUrl(val: string): boolean {
  try {
    new URL(val);
    return true;
  } catch {
    return false;
  }
}

export interface ProductImageData {
  id: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface EditProductFormProps {
  id: string;
  locale: string;
  initial: {
    name: string;
    nameEn: string;
    nameAr: string;
    slug: string;
    excerpt: string;
    excerptEn: string;
    excerptAr: string;
    description: string;
    descriptionEn: string;
    descriptionAr: string;
    image: string;
    published: boolean;
    isFeatured: boolean;
    images: ProductImageData[];
    specifications: Record<string, string> | null;
  };
}

type FieldErrors = Record<string, string>;

export function EditProductForm({ id, locale, initial }: EditProductFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initial.name);
  const [nameEn, setNameEn] = useState(initial.nameEn);
  const [nameAr, setNameAr] = useState(initial.nameAr);
  const [slug, setSlug] = useState(initial.slug);
  const [excerpt, setExcerpt] = useState(initial.excerpt);
  const [excerptEn, setExcerptEn] = useState(initial.excerptEn);
  const [excerptAr, setExcerptAr] = useState(initial.excerptAr);
  const [description, setDescription] = useState(initial.description);
  const [descriptionEn, setDescriptionEn] = useState(initial.descriptionEn);
  const [descriptionAr, setDescriptionAr] = useState(initial.descriptionAr);
  const [image, setImage] = useState(initial.image);
  const [published, setPublished] = useState(initial.published);
  const [isFeatured, setIsFeatured] = useState(initial.isFeatured);
  const [existingImages] = useState<ProductImageData[]>(initial.images);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [specRows, setSpecRows] = useState<SpecRow[]>(() => specsToRows(initial.specifications));

  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'saving'>('idle');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    e.target.value = '';
  }

  function removeNewImage(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function removeExistingImage(imageId: string) {
    setDeletedImageIds((prev) => [...prev, imageId]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const trimmedImage = image.trim();
    if (trimmedImage !== '' && !isValidUrl(trimmedImage)) {
      setErrors({ image: 'Image URL must be a valid URL (e.g. https://example.com/image.jpg)' });
      return;
    }

    setSubmitting(true);

    try {
      // ── Step 1: Upload new files ────────────────────────────────────────────
      let uploadedUrls: string[] = [];
      if (selectedFiles.length > 0) {
        setUploadStatus('uploading');
        const formData = new FormData();
        for (const file of selectedFiles) formData.append('images', file);

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

      // ── Step 2: PATCH product ───────────────────────────────────────────────
      setUploadStatus('saving');
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
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
          image: trimmedImage,
          published,
          isFeatured,
          specifications: rowsToSpecs(specRows),
          deletedImageIds,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrors(json.errors ?? { server: 'Something went wrong.' });
        return;
      }

      // ── Step 3: Save new ProductImage records ───────────────────────────────
      if (uploadedUrls.length > 0) {
        const nextSortOrder = existingImages.filter(img => !deletedImageIds.includes(img.id)).length;
        const imgRes = await fetch('/api/products/images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: id,
            urls: uploadedUrls,
            startSortOrder: nextSortOrder,
          }),
        });
        if (!imgRes.ok) {
          const imgJson = await imgRes.json();
          console.error('Failed to save product images');
          setErrors({ server: `Product saved but image upload failed: ${imgJson.error ?? 'unknown'}` });
          return;
        }
      }

      router.push(`/${locale}/admin/products`);
      router.refresh();
    } catch (err) {
      console.error('Failed to edit product:', err);
      setErrors({ server: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
      setUploadStatus('idle');
    }
  }

  const submitLabel = !submitting
    ? 'Save Changes'
    : uploadStatus === 'uploading'
      ? 'Uploading…'
      : 'Saving…';

  const inputCls =
    'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50';
  const textareaCls = `${inputCls} resize-y`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.server && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors.server}
        </div>
      )}

      {/* ── Persian fields ── */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
          className={inputCls} disabled={submitting} />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
          Slug <span className="text-red-500">*</span>
        </label>
        <input id="slug" type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
          className={`${inputCls} font-mono`} disabled={submitting} />
        <p className="mt-1 text-xs text-gray-400">Lowercase and hyphenated.</p>
        {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug}</p>}
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
          Excerpt <span className="text-red-500">*</span>
        </label>
        <textarea id="excerpt" rows={2} value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className={`${textareaCls} resize-none`} disabled={submitting} />
        {errors.excerpt && <p className="mt-1 text-xs text-red-600">{errors.excerpt}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea id="description" rows={8} value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={textareaCls} disabled={submitting} />
        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
      </div>

      {/* ── English fields ── */}
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 space-y-4">
        <p className="text-sm font-semibold text-blue-800">
          🇬🇧 English Details{' '}
          <span className="font-normal text-blue-500">(optional)</span>
        </p>

        <div>
          <label htmlFor="nameEn" className="block text-sm font-medium text-gray-700 mb-1">
            Name (English)
          </label>
          <input id="nameEn" type="text" value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            placeholder="Product name in English"
            className={inputCls} disabled={submitting} />
        </div>

        <div>
          <label htmlFor="excerptEn" className="block text-sm font-medium text-gray-700 mb-1">
            Excerpt (English)
          </label>
          <textarea id="excerptEn" rows={2} value={excerptEn}
            onChange={(e) => setExcerptEn(e.target.value)}
            placeholder="Brief English summary…"
            className={`${textareaCls} resize-none`} disabled={submitting} />
        </div>

        <div>
          <label htmlFor="descriptionEn" className="block text-sm font-medium text-gray-700 mb-1">
            Description (English)
          </label>
          <textarea id="descriptionEn" rows={6} value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
            placeholder="Full English product description…"
            className={textareaCls} disabled={submitting} />
        </div>
      </div>

      {/* ── Arabic fields ── */}
      <div className="rounded-lg border border-green-100 bg-green-50 p-4 space-y-4">
        <p className="text-sm font-semibold text-green-800">
          🇸🇦 Arabic Details{' '}
          <span className="font-normal text-green-500">(optional)</span>
        </p>

        <div>
          <label htmlFor="nameAr" className="block text-sm font-medium text-gray-700 mb-1">
            Name (Arabic)
          </label>
          <input id="nameAr" type="text" dir="rtl" value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            placeholder="اسم المنتج بالعربية"
            className={inputCls} disabled={submitting} />
        </div>

        <div>
          <label htmlFor="excerptAr" className="block text-sm font-medium text-gray-700 mb-1">
            Excerpt (Arabic)
          </label>
          <textarea id="excerptAr" rows={2} dir="rtl" value={excerptAr}
            onChange={(e) => setExcerptAr(e.target.value)}
            placeholder="ملخص قصير بالعربية..."
            className={`${textareaCls} resize-none`} disabled={submitting} />
        </div>

        <div>
          <label htmlFor="descriptionAr" className="block text-sm font-medium text-gray-700 mb-1">
            Description (Arabic)
          </label>
          <textarea id="descriptionAr" rows={6} dir="rtl" value={descriptionAr}
            onChange={(e) => setDescriptionAr(e.target.value)}
            placeholder="وصف المنتج الكامل بالعربية..."
            className={textareaCls} disabled={submitting} />
        </div>
      </div>

      {/* ── Existing images ── */}
      {existingImages.filter((img) => !deletedImageIds.includes(img.id)).length > 0 && (
        <div>
          <p className="block text-sm font-medium text-gray-700 mb-2">Current Images</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {existingImages
              .filter((img) => !deletedImageIds.includes(img.id))
              .map((img) => (
                <div key={img.id} className="relative aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" className="h-full w-full rounded-lg object-cover border border-gray-200" />
                  {img.isPrimary && (
                    <span className="absolute bottom-0 left-0 rounded-br rounded-tl-lg bg-black/50 px-1 py-0.5 text-[10px] text-white">
                      Primary
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.id)}
                    disabled={submitting}
                    aria-label="Remove image"
                    className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-bl rounded-tr-lg bg-red-500 text-white text-xs leading-none hover:bg-red-600 disabled:opacity-50"
                  >
                    ×
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

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

      {/* ── Image URL (legacy) ── */}
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
          Image URL <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <input id="image" type="text" value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className={inputCls} disabled={submitting} />
        <p className="mt-1 text-xs text-gray-400">Paste an absolute URL, or upload new files below.</p>
        {errors.image && <p className="mt-1 text-xs text-red-600">{errors.image}</p>}
      </div>

      {/* ── Add new images ── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Add Images <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple disabled={submitting} onChange={handleFileChange}
          className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100 disabled:opacity-50" />
        <p className="mt-1 text-xs text-gray-400">
          JPG, PNG, WebP · max 5 MB each · appended to existing images.
        </p>
        {uploadStatus === 'uploading' && (
          <p className="mt-1 text-xs text-blue-600 animate-pulse">Uploading images…</p>
        )}
        {selectedFiles.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {selectedFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} className="relative aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={URL.createObjectURL(file)} alt={file.name}
                  className="h-full w-full rounded-lg object-cover border border-gray-200" />
                <button type="button" onClick={() => removeNewImage(index)} disabled={submitting}
                  aria-label={`Remove ${file.name}`}
                  className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-bl rounded-tr-lg bg-red-500 text-white text-xs leading-none hover:bg-red-600 disabled:opacity-50">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Published toggle ── */}
      <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
        <button id="published" type="button" role="switch" aria-checked={published}
          onClick={() => setPublished((v) => !v)} disabled={submitting}
          className={[
            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
            'transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
            published ? 'bg-brand-600' : 'bg-gray-300',
            'disabled:opacity-50',
          ].join(' ')}>
          <span className={[
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0',
            'transition duration-200 ease-in-out',
            published ? 'translate-x-5' : 'translate-x-0',
          ].join(' ')} />
        </button>
        <label htmlFor="published" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
          Published
        </label>
        <span className="ml-auto text-xs text-gray-400">
          {published ? 'Visible to visitors' : 'Saved as draft'}
        </span>
      </div>

      {/* ── Featured on homepage toggle ── */}
      <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
        <button id="isFeatured" type="button" role="switch" aria-checked={isFeatured}
          onClick={() => setIsFeatured((v) => !v)} disabled={submitting}
          className={[
            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
            'transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
            isFeatured ? 'bg-brand-600' : 'bg-gray-300',
            'disabled:opacity-50',
          ].join(' ')}>
          <span className={[
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0',
            'transition duration-200 ease-in-out',
            isFeatured ? 'translate-x-5' : 'translate-x-0',
          ].join(' ')} />
        </button>
        <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
          Show on Homepage (Featured) / نمایش در صفحه اصلی (محصول ویژه)
        </label>
        <span className="ml-auto text-xs text-gray-400">
          {isFeatured ? 'Shown in the homepage "Our Products" section' : 'Not featured'}
        </span>
      </div>

      {/* ── Actions ── */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button type="button" onClick={() => router.back()} disabled={submitting}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50">
          Cancel
        </button>
        <button type="submit" disabled={submitting}
          className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-60">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

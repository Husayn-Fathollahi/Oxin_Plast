// import { NextResponse } from 'next/server';
// import { z } from 'zod';
// import { prisma } from '@/lib/prisma';

// // ── Validation schema (all fields optional for PATCH) ─────────────────────────
// const PatchProductSchema = z.object({
//   name: z.string().trim().min(2, 'Name must be at least 2 characters').max(255).optional(),
//   nameEn: z.string().trim().max(255).optional().or(z.literal('')),
//   nameAr: z.string().trim().max(255).optional().or(z.literal('')),
//   slug: z
//     .string()
//     .trim()
//     .min(2)
//     .max(255)
//     .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase-hyphenated')
//     .optional(),
//   excerpt: z.string().trim().min(10, 'Excerpt must be at least 10 characters').max(500).optional(),
//   excerptEn: z.string().trim().max(500).optional().or(z.literal('')),
//   excerptAr: z.string().trim().max(500).optional().or(z.literal('')),
//   description: z.string().trim().min(20, 'Description must be at least 20 characters').optional(),
//   descriptionEn: z.string().trim().optional().or(z.literal('')),
//   descriptionAr: z.string().trim().optional().or(z.literal('')),
//   image: z.string().trim().url('Image must be a valid URL').optional().or(z.literal('')),
//   published: z.boolean().optional(),
//   isFeatured: z.boolean().optional(),
//   specifications: z.record(z.string(), z.string()).nullable().optional(),
// });

// // ── GET /api/products/[id] ────────────────────────────────────────────────────
// export async function GET(
//   _request: Request,
//   { params }: { params: Promise<{ id: string }> },
// ) {
//   const { id } = await params;
//   const product = await prisma.product.findUnique({
//     where: { id },
//     include: { images: { orderBy: { sortOrder: 'asc' } } },
//   });
//   if (!product) {
//     return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
//   }
//   return NextResponse.json({ success: true, data: product });
// }

// // ── PATCH /api/products/[id] ──────────────────────────────────────────────────
// export async function PATCH(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> },
// ) {
//   const { id } = await params;

//   // Ensure product exists
//   const existing = await prisma.product.findUnique({ where: { id }, select: { id: true } });
//   if (!existing) {
//     return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
//   }

//   let rawBody: unknown;
//   try {
//     rawBody = await request.json();
//   } catch {
//     return NextResponse.json(
//       { success: false, errors: { server: 'Invalid request body' } },
//       { status: 400 },
//     );
//   }

//   const parsed = PatchProductSchema.safeParse(rawBody);
//   if (!parsed.success) {
//     const errors: Record<string, string> = {};
//     for (const issue of parsed.error.issues) {
//       const field = String(issue.path[0] ?? 'server');
//       if (!errors[field]) errors[field] = issue.message;
//     }
//     return NextResponse.json({ success: false, errors }, { status: 400 });
//   }

//   const { image, nameEn, nameAr, excerptEn, excerptAr, descriptionEn, descriptionAr, specifications, ...rest } = parsed.data;

//   // Build update payload — only include fields that were sent
//   const data: Record<string, unknown> = { ...rest };
//   if (image !== undefined) data.image = image || null;
//   if (nameEn !== undefined) data.nameEn = nameEn || null;
//   if (nameAr !== undefined) data.nameAr = nameAr || null;
//   if (excerptEn !== undefined) data.excerptEn = excerptEn || null;
//   if (excerptAr !== undefined) data.excerptAr = excerptAr || null;
//   if (descriptionEn !== undefined) data.descriptionEn = descriptionEn || null;
//   if (descriptionAr !== undefined) data.descriptionAr = descriptionAr || null;
//   if (specifications !== undefined) data.specifications = specifications ?? null;

//   try {
//     const product = await prisma.product.update({ where: { id }, data });
//     return NextResponse.json({ success: true, data: product });
//   } catch (err: unknown) {
//     if (
//       typeof err === 'object' &&
//       err !== null &&
//       'code' in err &&
//       (err as { code: string }).code === 'P2002'
//     ) {
//       return NextResponse.json(
//         { success: false, errors: { slug: 'Slug already exists' } },
//         { status: 409 },
//       );
//     }
//     console.error('Failed to update product:', err);
//     return NextResponse.json(
//       { success: false, errors: { server: 'Failed to update product' } },
//       { status: 500 },
//     );
//   }
// }

// // ── DELETE /api/products/[id] ─────────────────────────────────────────────────
// export async function DELETE(
//   _request: Request,
//   { params }: { params: Promise<{ id: string }> },
// ) {
//   const { id } = await params;

//   const existing = await prisma.product.findUnique({ where: { id }, select: { id: true } });
//   if (!existing) {
//     return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
//   }

//   try {
//     // ProductImage rows are deleted automatically via onDelete: Cascade
//     await prisma.product.delete({ where: { id } });
//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error('Failed to delete product:', err);
//     return NextResponse.json(
//       { success: false, error: 'Failed to delete product' },
//       { status: 500 },
//     );
//   }
// }


import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// ── Validation schema (all fields optional for PATCH) ────────────────────────
const PatchProductSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(255).optional(),
  nameEn: z.string().trim().max(255).optional().or(z.literal('')),
  nameAr: z.string().trim().max(255).optional().or(z.literal('')),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase-hyphenated')
    .optional(),
  excerpt: z.string().trim().min(10, 'Excerpt must be at least 10 characters').max(500).optional(),
  excerptEn: z.string().trim().max(500).optional().or(z.literal('')),
  excerptAr: z.string().trim().max(500).optional().or(z.literal('')),
  description: z.string().trim().min(20, 'Description must be at least 20 characters').optional(),
  descriptionEn: z.string().trim().optional().or(z.literal('')),
  descriptionAr: z.string().trim().optional().or(z.literal('')),
  image: z.string().trim().url('Image must be a valid URL').optional().or(z.literal('')),
  published: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  specifications: z.record(z.string(), z.string()).nullable().optional(),
  deletedImageIds: z.array(z.string()).optional(),
});

// ── GET /api/products/[id] ───────────────────────────────────────────────────
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: 'asc' } } },
  });
  if (!product) {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: product });
}

// ── PATCH /api/products/[id] ────────────────────────────────────────────────
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Ensure product exists
  const existing = await prisma.product.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, errors: { server: 'Invalid request body' } },
      { status: 400 },
    );
  }

  const parsed = PatchProductSchema.safeParse(rawBody);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? 'server');
      if (!errors[field]) errors[field] = issue.message;
    }
    return NextResponse.json({ success: false, errors }, { status: 400 });
  }

  const {
    image,
    nameEn,
    nameAr,
    excerptEn,
    excerptAr,
    descriptionEn,
    descriptionAr,
    specifications,
    deletedImageIds,
    ...rest
  } = parsed.data;

  // Build update payload ── only include fields that were sent
  const data: Record<string, unknown> = { ...rest };
  if (image !== undefined) data.image = image || null;
  if (nameEn !== undefined) data.nameEn = nameEn || null;
  if (nameAr !== undefined) data.nameAr = nameAr || null;
  if (excerptEn !== undefined) data.excerptEn = excerptEn || null;
  if (excerptAr !== undefined) data.excerptAr = excerptAr || null;
  if (descriptionEn !== undefined) data.descriptionEn = descriptionEn || null;
  if (descriptionAr !== undefined) data.descriptionAr = descriptionAr || null;
  if (specifications !== undefined) data.specifications = specifications ?? null;

  try {
    // Delete requested images from database
    if (deletedImageIds && deletedImageIds.length > 0) {
      await prisma.productImage.deleteMany({
        where: {
          id: { in: deletedImageIds },
          productId: id,
        },
      });
    }

    const product = await prisma.product.update({ where: { id }, data });
    return NextResponse.json({ success: true, data: product });
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: string }).code === 'P2002'
    ) {
      return NextResponse.json(
        { success: false, errors: { slug: 'Slug already exists' } },
        { status: 409 },
      );
    }
    console.error('Failed to update product:', err);
    return NextResponse.json(
      { success: false, errors: { server: 'Failed to update product' } },
      { status: 500 },
    );
  }
}

// ── DELETE /api/products/[id] ───────────────────────────────────────────────
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const existing = await prisma.product.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  try {
    // ProductImage rows are deleted automatically via onDelete: Cascade
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to delete product:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 },
    );
  }
}

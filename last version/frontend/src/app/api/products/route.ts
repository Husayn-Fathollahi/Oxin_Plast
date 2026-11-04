import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// ── Validation schema ─────────────────────────────────────────────────────────
const ProductSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(255),
  nameEn: z.string().trim().max(255).optional().or(z.literal('')),
  nameAr: z.string().trim().max(255).optional().or(z.literal('')),
  slug: z
    .string()
    .trim()
    .min(2, 'Slug must be at least 2 characters')
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase-hyphenated'),
  excerpt: z.string().trim().min(10, 'Excerpt must be at least 10 characters').max(500),
  excerptEn: z.string().trim().max(500).optional().or(z.literal('')),
  excerptAr: z.string().trim().max(500).optional().or(z.literal('')),
  description: z.string().trim().min(20, 'Description must be at least 20 characters'),
  descriptionEn: z.string().trim().optional().or(z.literal('')),
  descriptionAr: z.string().trim().optional().or(z.literal('')),
  image: z.string().trim().url('Image must be a valid URL').optional().or(z.literal('')),
  published: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
  specifications: z.record(z.string(), z.string()).nullable().optional(),
});

// ── GET /api/products ─────────────────────────────────────────────────────────
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        excerpt: true,
        image: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json({ success: true, data: products });
  } catch (err) {
    console.error('Failed to fetch products:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 },
    );
  }
}

// ── POST /api/products ────────────────────────────────────────────────────────
export async function POST(request: Request) {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, errors: { server: 'Invalid request body' } },
      { status: 400 },
    );
  }

  const parsed = ProductSchema.safeParse(rawBody);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? 'server');
      if (!errors[field]) errors[field] = issue.message;
    }
    return NextResponse.json({ success: false, errors }, { status: 400 });
  }

  const { image, nameEn, nameAr, excerptEn, excerptAr, descriptionEn, descriptionAr, specifications, ...rest } = parsed.data;

  try {
    const product = await prisma.product.create({
      data: {
        ...rest,
        image: image || null,
        nameEn: nameEn || null,
        nameAr: nameAr || null,
        excerptEn: excerptEn || null,
        excerptAr: excerptAr || null,
        descriptionEn: descriptionEn || null,
        descriptionAr: descriptionAr || null,
        specifications: specifications ?? undefined,
      },
    });
    return NextResponse.json({ success: true, data: product }, { status: 201 });
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
    console.error('Failed to create product:', err);
    return NextResponse.json(
      { success: false, errors: { server: 'Failed to create product' } },
      { status: 500 },
    );
  }
}

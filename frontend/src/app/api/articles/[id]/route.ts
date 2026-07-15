import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// ── Validation schema (all fields optional for PATCH) ─────────────────────────
const PatchArticleSchema = z.object({
  title: z.string().trim().min(1).max(255).optional(),
  titleEn: z.string().trim().max(255).optional().or(z.literal('')),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase-hyphenated')
    .optional(),
  excerpt: z.string().trim().min(1).max(500).optional(),
  excerptEn: z.string().trim().max(500).optional().or(z.literal('')),
  content: z.string().trim().min(1).optional(),
  contentEn: z.string().trim().optional().or(z.literal('')),
  image: z.string().trim().optional().or(z.literal('')),
  published: z.boolean().optional(),
});

// ── GET /api/articles/[id] ────────────────────────────────────────────────────
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: article });
}

// ── PATCH /api/articles/[id] ──────────────────────────────────────────────────
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const existing = await prisma.article.findUnique({ where: { id }, select: { id: true } });
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

  const parsed = PatchArticleSchema.safeParse(rawBody);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? 'server');
      if (!errors[field]) errors[field] = issue.message;
    }
    return NextResponse.json({ success: false, errors }, { status: 400 });
  }

  const { image, titleEn, excerptEn, contentEn, ...rest } = parsed.data;
  const data: Record<string, unknown> = { ...rest };
  if (image !== undefined) data.image = image || null;
  if (titleEn !== undefined) data.titleEn = titleEn || null;
  if (excerptEn !== undefined) data.excerptEn = excerptEn || null;
  if (contentEn !== undefined) data.contentEn = contentEn || null;

  try {
    const article = await prisma.article.update({ where: { id }, data });
    return NextResponse.json({ success: true, data: article });
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
    console.error('Failed to update article:', err);
    return NextResponse.json(
      { success: false, errors: { server: 'Failed to update article' } },
      { status: 500 },
    );
  }
}

// ── DELETE /api/articles/[id] ─────────────────────────────────────────────────
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const existing = await prisma.article.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  try {
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to delete article:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to delete article' },
      { status: 500 },
    );
  }
}

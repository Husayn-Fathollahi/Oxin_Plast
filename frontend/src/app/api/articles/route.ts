import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// ── Validation schema ─────────────────────────────────────────────────────────
const ArticleSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(255),
  titleEn: z.string().trim().max(255).optional().or(z.literal('')),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase-hyphenated'),
  excerpt: z.string().trim().min(1, 'Excerpt is required').max(500),
  excerptEn: z.string().trim().max(500).optional().or(z.literal('')),
  content: z.string().trim().min(1, 'Content is required'),
  contentEn: z.string().trim().optional().or(z.literal('')),
  image: z.string().trim().optional().or(z.literal('')),
  published: z.boolean().optional().default(false),
});

// ── GET /api/articles ─────────────────────────────────────────────────────────
export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json({ success: true, data: articles });
  } catch (err) {
    console.error('Failed to fetch articles:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles' },
      { status: 500 },
    );
  }
}

// ── POST /api/articles ────────────────────────────────────────────────────────
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

  const parsed = ArticleSchema.safeParse(rawBody);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? 'server');
      if (!errors[field]) errors[field] = issue.message;
    }
    return NextResponse.json({ success: false, errors }, { status: 400 });
  }

  try {
    const { image, titleEn, excerptEn, contentEn, ...rest } = parsed.data;
    const article = await prisma.article.create({
      data: {
        ...rest,
        image: image || null,
        titleEn: titleEn || null,
        excerptEn: excerptEn || null,
        contentEn: contentEn || null,
      },
    });
    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (err: unknown) {
    // Unique constraint on slug
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
    console.error('Failed to create article:', err);
    return NextResponse.json(
      { success: false, errors: { server: 'Failed to create article' } },
      { status: 500 },
    );
  }
}

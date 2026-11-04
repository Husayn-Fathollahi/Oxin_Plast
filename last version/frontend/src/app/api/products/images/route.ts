import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/products/images
// Body: { productId: string; urls: string[] }
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { productId, urls } = body as { productId?: string; urls?: unknown };

  if (!productId || typeof productId !== 'string') {
    return NextResponse.json({ error: 'productId is required' }, { status: 400 });
  }

  if (!Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json({ error: 'urls must be a non-empty array' }, { status: 400 });
  }

  const validUrls = urls.filter((u): u is string => typeof u === 'string' && u.trim() !== '');
  if (validUrls.length === 0) {
    return NextResponse.json({ error: 'No valid URLs provided' }, { status: 400 });
  }

  try {
    const images = await prisma.$transaction(
      validUrls.map((url, index) =>
        prisma.productImage.create({
          data: {
            productId,
            url,
            sortOrder: index,
            isPrimary: index === 0,
          },
        })
      )
    );

    return NextResponse.json({ success: true, data: images }, { status: 201 });
  } catch (err) {
    console.error('Failed to save product images:', err);
    return NextResponse.json({ error: 'Failed to save product images' }, { status: 500 });
  }
}

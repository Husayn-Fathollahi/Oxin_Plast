import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const updated = await prisma.message.update({
    where: { id },
    data: { readStatus: true },
    select: { id: true, readStatus: true },
  }).catch(() => null);

  if (!updated) {
    return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, id: updated.id });
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await prisma.message.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    // Prisma throws P2025 when the record doesn't exist
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: string }).code === 'P2025'
    ) {
      return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 });
    }
    console.error('Failed to delete message:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

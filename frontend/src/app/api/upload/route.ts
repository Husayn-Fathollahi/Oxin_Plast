import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import {
  ALLOWED_MIME_TYPES,
  type AllowedMime,
  validateMagicBytes,
  generateSafeFilename,
} from '@/lib/upload-guard';

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'blog');

export async function POST(request: NextRequest) {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('image');

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 });
  }

  // MIME type allow-list check (never echo back the user-supplied type)
  if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)) {
    return NextResponse.json(
      { error: 'File type not allowed. Only jpg, png, webp images are accepted.' },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: 'File exceeds the 5 MB size limit.' },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Magic-byte validation — ensures file content matches the declared MIME type.
  // Rejects HTML/JS/SVG files disguised with an image MIME type.
  if (!validateMagicBytes(buffer, file.type)) {
    return NextResponse.json(
      { error: 'File content is not a valid image.' },
      { status: 400 },
    );
  }

  // Safe filename: extension derived from validated MIME type, never from the
  // original filename, preventing path-traversal via crafted filenames.
  const uniqueName = generateSafeFilename(file.type as AllowedMime);
  const filePath = path.join(UPLOAD_DIR, uniqueName);

  await fs.writeFile(filePath, buffer);

  return NextResponse.json({ url: `/uploads/blog/${uniqueName}` });
}

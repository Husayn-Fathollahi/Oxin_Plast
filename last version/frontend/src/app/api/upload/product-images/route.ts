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
const MAX_FILE_COUNT = 10;
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'products');

export async function POST(request: NextRequest) {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const files = formData.getAll('images');

  if (!files || files.length === 0) {
    return NextResponse.json({ error: 'No images provided' }, { status: 400 });
  }

  // Enforce max file count per request to prevent bulk-upload DoS
  if (files.length > MAX_FILE_COUNT) {
    return NextResponse.json(
      { error: `Too many files. Maximum ${MAX_FILE_COUNT} images per upload.` },
      { status: 400 },
    );
  }

  const urls: string[] = [];

  for (const file of files) {
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Invalid file entry' }, { status: 400 });
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
        { error: 'A file exceeds the 5 MB size limit.' },
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

    urls.push(`/uploads/products/${uniqueName}`);
  }

  return NextResponse.json({ urls });
}

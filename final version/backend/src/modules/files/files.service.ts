import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import { PrismaService } from '../../common/utils/prisma.service';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private readonly uploadDir =
    process.env.UPLOAD_DIR ?? path.join(process.cwd(), 'uploads');

  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.file.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async saveFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type "${file.mimetype}" is not allowed`,
      );
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException('File exceeds maximum size of 10 MB');
    }

    // Ensure the upload directory exists
    await fs.mkdir(this.uploadDir, { recursive: true });

    const filename = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const filePath = path.join(this.uploadDir, filename);
    await fs.writeFile(filePath, file.buffer);

    const record = await this.prisma.file.create({
      data: {
        originalName: file.originalname,
        filename,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        url: `/uploads/${filename}`,
      },
    });

    this.logger.log(`File saved: ${filename}`);
    return record;
  }

  async remove(id: string) {
    const file = await this.prisma.file.findUnique({ where: { id } });
    if (!file) throw new NotFoundException(`File "${id}" not found`);

    const filePath = path.join(this.uploadDir, file.filename);
    try {
      await fs.unlink(filePath);
    } catch {
      this.logger.warn(`Could not delete physical file: ${filePath}`);
    }

    return this.prisma.file.delete({ where: { id } });
  }
}

import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * FilesController
 * Handles image and PDF uploads for the media library.
 * All endpoints require authentication.
 *
 * File validation (type, size) is enforced in FilesService.
 */
@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  /** GET /api/v1/files — list all uploaded files */
  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  /**
   * POST /api/v1/files/upload — upload a single file (image or PDF).
   * Accepts multipart/form-data with field name "file".
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.saveFile(file);
  }

  /** DELETE /api/v1/files/:id — delete a file record and its stored copy */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.filesService.remove(id);
  }
}

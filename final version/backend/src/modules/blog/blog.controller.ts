import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../../common/utils/decorators';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  /** GET /api/v1/blog — public */
  @Public()
  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  /** GET /api/v1/blog/:slug — public */
  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }

  /** POST /api/v1/blog — protected */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateArticleDto) {
    return this.blogService.create(dto);
  }

  /** PATCH /api/v1/blog/:id — protected */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
    return this.blogService.update(id, dto);
  }

  /** DELETE /api/v1/blog/:id — protected */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}

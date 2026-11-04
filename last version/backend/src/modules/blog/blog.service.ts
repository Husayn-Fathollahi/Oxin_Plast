import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/utils/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.article.findMany({
      where: { status: 'published' },
      orderBy: { publishedAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const article = await this.prisma.article.findUnique({ where: { slug } });
    if (!article) throw new NotFoundException(`Article "${slug}" not found`);
    return article;
  }

  create(dto: CreateArticleDto) {
    return this.prisma.article.create({ data: dto });
  }

  async update(id: string, dto: UpdateArticleDto) {
    await this.findById(id);
    return this.prisma.article.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.article.delete({ where: { id } });
  }

  private async findById(id: string) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException(`Article "${id}" not found`);
    return article;
  }
}

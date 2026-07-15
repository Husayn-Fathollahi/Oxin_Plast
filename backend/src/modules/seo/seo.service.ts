import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/utils/prisma.service';
import { UpdateSeoConfigDto } from './dto/update-seo-config.dto';

@Injectable()
export class SeoService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.seoConfig.findMany();
  }

  async findByRouteKey(routeKey: string) {
    const config = await this.prisma.seoConfig.findUnique({ where: { routeKey } });
    if (!config) throw new NotFoundException(`SEO config for "${routeKey}" not found`);
    return config;
  }

  async update(id: string, dto: UpdateSeoConfigDto) {
    const config = await this.prisma.seoConfig.findUnique({ where: { id } });
    if (!config) throw new NotFoundException(`SEO config "${id}" not found`);
    return this.prisma.seoConfig.update({ where: { id }, data: dto });
  }
}

import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { SeoService } from './seo.service';
import { UpdateSeoConfigDto } from './dto/update-seo-config.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../../common/utils/decorators';

@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  /** GET /api/v1/seo — public; used by the frontend to fetch per-page SEO configs */
  @Public()
  @Get()
  findAll() {
    return this.seoService.findAll();
  }

  /** GET /api/v1/seo/:routeKey — public */
  @Public()
  @Get(':routeKey')
  findOne(@Param('routeKey') routeKey: string) {
    return this.seoService.findByRouteKey(routeKey);
  }

  /** PATCH /api/v1/seo/:id — admin */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSeoConfigDto) {
    return this.seoService.update(id, dto);
  }
}

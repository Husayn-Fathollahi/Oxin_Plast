import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/utils/prisma.service';

/**
 * CoreModule — provides globally-shared singleton services (e.g. PrismaService).
 * Import this module in AppModule; do NOT re-import in feature modules.
 */
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class CoreModule {}

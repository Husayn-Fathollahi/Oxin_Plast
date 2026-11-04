import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './common/services/prisma.service';
import configuration from './config/configuration';
import { validationSchema } from './config/validation-schema';

// ─── Feature modules ──────────────────────────────────────────────────────
import { CoreModule } from './modules/core/core.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { BlogModule } from './modules/blog/blog.module';
import { ContactModule } from './modules/contact/contact.module';
import { FilesModule } from './modules/files/files.module';
import { SeoModule } from './modules/seo/seo.module';

@Module({
  imports: [
    // Load and validate environment variables globally
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      validationOptions: { abortEarly: false },
    }),

    // Feature modules
    CoreModule,
    HealthModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    BlogModule,
    ContactModule,
    FilesModule,
    SeoModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}

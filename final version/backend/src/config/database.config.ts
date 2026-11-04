import { registerAs } from '@nestjs/config';

/**
 * database.config.ts
 * Namespaced database configuration token.
 * Usage: configService.get<DatabaseConfig>('database')
 */
export interface DatabaseConfig {
  url: string;
}

export default registerAs('database', (): DatabaseConfig => ({
  url: process.env.DATABASE_URL as string,
}));

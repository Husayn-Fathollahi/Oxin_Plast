import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

function createPrismaClient() {
  // Resolve DATABASE_URL to an absolute path so better-sqlite3
  // always finds the same file regardless of working directory.
  const rawUrl =
    process.env.DATABASE_URL ?? `file:./prisma/contact.db`;

  // Convert any relative `file:…` path to an absolute one so the database
  // is always found regardless of the working directory at runtime.
  const filePath = rawUrl.startsWith('file:') ? rawUrl.slice('file:'.length) : null;
  const dbUrl =
    filePath !== null && !path.isAbsolute(filePath)
      ? `file:${path.resolve(process.cwd(), filePath)}`
      : rawUrl;

  const adapter = new PrismaBetterSqlite3({ url: dbUrl });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;



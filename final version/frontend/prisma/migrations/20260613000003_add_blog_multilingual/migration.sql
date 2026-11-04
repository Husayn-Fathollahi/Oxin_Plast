-- AlterTable: add optional multilingual and image fields to Article
ALTER TABLE "Article" ADD COLUMN "titleEn" TEXT;
ALTER TABLE "Article" ADD COLUMN "excerptEn" TEXT;
ALTER TABLE "Article" ADD COLUMN "contentEn" TEXT;
ALTER TABLE "Article" ADD COLUMN "image" TEXT;

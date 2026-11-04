-- AlterTable: add optional Arabic parallel fields to Product
ALTER TABLE "Product" ADD COLUMN "nameAr" TEXT;
ALTER TABLE "Product" ADD COLUMN "excerptAr" TEXT;
ALTER TABLE "Product" ADD COLUMN "descriptionAr" TEXT;

-- AlterTable: add optional Arabic parallel fields to Article
ALTER TABLE "Article" ADD COLUMN "titleAr" TEXT;
ALTER TABLE "Article" ADD COLUMN "excerptAr" TEXT;
ALTER TABLE "Article" ADD COLUMN "contentAr" TEXT;

-- AlterTable: add optional English parallel fields to Product
ALTER TABLE "Product" ADD COLUMN "nameEn" TEXT;
ALTER TABLE "Product" ADD COLUMN "excerptEn" TEXT;
ALTER TABLE "Product" ADD COLUMN "descriptionEn" TEXT;

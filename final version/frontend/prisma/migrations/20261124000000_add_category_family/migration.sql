-- AlterTable: add optional categoryFamily column to Product
-- Non-destructive: existing rows get NULL (no family), which is correct behaviour.
ALTER TABLE "Product" ADD COLUMN "categoryFamily" TEXT;

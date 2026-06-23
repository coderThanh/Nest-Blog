-- AlterTable
ALTER TABLE "Category" DROP COLUMN "search";

ALTER TABLE "Category" ADD COLUMN "search" TEXT  GENERATED ALWAYS AS (lower(immute_unaccent("name"))) STORED;

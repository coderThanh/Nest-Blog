/*
  Warnings:

  - Made the column `path` on table `Category` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable

UPDATE "Category"
SET "path" = ''
WHERE "path" IS NULL;

ALTER TABLE "Category" ALTER COLUMN "path" SET NOT NULL;

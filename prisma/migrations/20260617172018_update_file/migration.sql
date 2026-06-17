/*
 Warnings:
 
 - You are about to drop the column `fileName` on the `File` table. All the data in the column will be lost.
 - You are about to drop the column `search` on the `File` table. All the data in the column will be lost.
 - Added the required column `file_name` to the `File` table without a default value. This is not possible if the table is not empty.
 
 */
-- AlterTable
ALTER TABLE "File"
  RENAME COLUMN "fileName" TO "file_name";

ALTER TABLE "File" DROP COLUMN "search";

-- CreateIndex
CREATE INDEX "File_file_name_idx" ON "File"("file_name");

-- 
ALTER TABLE "Post" DROP COLUMN "search";

ALTER TABLE "Post"
ADD COLUMN "search" TEXT GENERATED ALWAYS AS (immute_unaccent("name")) STORED;

ALTER TABLE "User" DROP COLUMN "search";

ALTER TABLE "User"
ADD COLUMN "search" tEXT GENERATED ALWAYS AS (
    immute_unaccent("name") || ' ' || COALESCE("phone", '') || ' ' || COALESCE("email", '')
  ) STORED;
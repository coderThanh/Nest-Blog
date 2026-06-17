/*
 Warnings:
 
 - You are about to drop the column `search` on the `Post` table. All the data in the column will be lost.
 - You are about to drop the column `search` on the `User` table. All the data in the column will be lost.
 
 */
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "search";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "search";

-- 
ALTER TABLE "Post"
ADD COLUMN "search" TEXT GENERATED ALWAYS AS (LOWER(immute_unaccent("name"))) STORED;

ALTER TABLE "User"
ADD COLUMN "search" TEXT GENERATED ALWAYS AS (
    LOWER(
      immute_unaccent("name") || ' ' || COALESCE("phone", '') || ' ' || COALESCE("email", '')
    )
  ) STORED;

DROP INDEX IF EXISTS "Post_search_idx";

CREATE INDEX concurrently "Post_search_idx" ON "Post"("search");

DROP INDEX IF EXISTS "User_search_idx";

CREATE INDEX concurrently "User_search_idx" ON "User"("search");
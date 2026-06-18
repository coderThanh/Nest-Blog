/*
 Warnings:
 
 - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
 - A unique constraint covering the columns `[slug]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
 - Added the required column `slug` to the `Post` table without a default value. This is not possible if the table is not empty.
 
 */
--

-- 1. Kích hoạt extension sinh UUID nếu chưa có
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION uuid_generate_v7() RETURNS uuid AS $$
DECLARE
  unix_time_ms bigint;
  rand_bytes bytea;
BEGIN
  unix_time_ms := (EXTRACT(EPOCH FROM CLOCK_TIMESTAMP()) * 1000)::bigint;
  rand_bytes := gen_random_bytes(10);
  
  RETURN (
    lpad(to_hex(unix_time_ms), 12, '0') ||
    '7' ||
    substr(encode(rand_bytes, 'hex'), 1, 3) ||
    substr(to_hex((get_byte(rand_bytes, 3) & 63) | 128), 1, 2) ||
    substr(encode(rand_bytes, 'hex'), 5, 14)
  )::uuid;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- AlterTable
ALTER TABLE "Post"
ADD COLUMN "short_description" TEXT,
  ADD COLUMN "slug" TEXT NOT NULL DEFAULT(uuid_generate_v7()::text),
  ALTER COLUMN "id"
SET DATA TYPE BIGINT,
ALTER COLUMN "id" DROP default;

-- Update sequence
DROP SEQUENCE IF EXISTS "Post_id_seq";

CREATE SEQUENCE "Post_id_seq" AS BIGINT OWNED BY "Post"."id";

SELECT setval(
    '"Post_id_seq"',
    COALESCE(MAX("id"), 0) + 1,
    false
  )
FROM "Post";

ALTER TABLE "Post" ALTER COLUMN "id" SET DEFAULT nextval('"Post_id_seq"');

-- CreateTable
CREATE TABLE "Category" (
  "id" BIGSERIAL NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL DEFAULT(uuid_generate_v7()::text),
  "search" TEXT GENERATED ALWAYS AS(immute_unaccent("name")) STORED,
  "description" TEXT,
  "thumbnail_id" TEXT,
  "parent_id" BIGINT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by" TEXT,
  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostCategory" (
  "post_id" BIGINT NOT NULL,
  "category_id" BIGINT NOT NULL,
  "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PostCategory_pkey" PRIMARY KEY ("post_id", "category_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_search_idx" ON "Category"("search");

-- CreateIndex
-- Mong muốn check unique khi cùng parent_id dù parent_id = null
CREATE UNIQUE INDEX "Category_name_parent_id_key" ON "Category"("name", "parent_id") NULLS NOT DISTINCT;

-- CreateIndex
CREATE INDEX "PostCategory_category_id_idx" ON "PostCategory"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- AddForeignKey
ALTER TABLE "Category"
ADD CONSTRAINT "Category_thumbnail_id_fkey" FOREIGN KEY ("thumbnail_id") REFERENCES "File"("id") ON DELETE
SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category"
ADD CONSTRAINT "Category_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Category"("id") ON DELETE
SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category"
ADD CONSTRAINT "Category_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE
SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCategory"
ADD CONSTRAINT "PostCategory_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCategory"
ADD CONSTRAINT "PostCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
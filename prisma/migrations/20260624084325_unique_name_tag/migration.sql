/*
 Warnings:
 
 - A unique constraint covering the columns `[name]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
 
 */
-- CreateIndex
ALTER TABLE "Tag"
ADD COLUMN "name_unique" text NOT NULL UNIQUE DEFAULT (gen_random_uuid());

DROP INDEX IF EXISTS "Tag_name_key";

UPDATE "Tag"
SET "name_unique" = "name" || '_' || "name_unique";

UPDATE "Tag" "t1"
SET "name" = "name_unique"
WHERE (
    SELECT COUNT(*)
    FROM "Tag" t2
    WHERE "t1"."name" = "t2"."name"
  ) != 1;

CREATE UNIQUE INDEX IF NOT EXISTS "Tag_name_key" ON "Tag"("name");

ALTER TABLE "Tag" DROP COLUMN "name_unique";
-- This is an empty migration.
ALTER TABLE "Category" DROP CONSTRAINT IF EXISTS "Category_parent_id_check_fkey";

ALTER TABLE "Category"
ADD CONSTRAINT "Category_parent_id_check_fkey" CHECK (
    "parent_id" IS NULL
    OR "parent_id" <> "id"
  );

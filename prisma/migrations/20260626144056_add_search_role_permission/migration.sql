-- AlterTable
ALTER TABLE "Permission"
ADD COLUMN "search" TEXT NOT NULL GENERATED ALWAYS AS (
    LOWER(
      immute_unaccent("module") || ' ' || immute_unaccent("permission") || ' ' || immute_unaccent("action")
    )
  ) STORED;

-- AlterTable
ALTER TABLE "Role"
ADD COLUMN "search" TEXT NOT NULL GENERATED ALWAYS AS (
    LOWER(immute_unaccent("name"))
  ) STORED;
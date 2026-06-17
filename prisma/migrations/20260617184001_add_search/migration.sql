-- This is an empty migration.

ALTER TABLE "Post"
ADD COLUMN "search" TEXT GENERATED ALWAYS AS (LOWER(immute_unaccent("name"))) STORED;

ALTER TABLE "User"
ADD COLUMN "search" TEXT GENERATED ALWAYS AS (
    LOWER(
      immute_unaccent("name") || ' ' || COALESCE("phone", '') || ' ' || COALESCE("email", '')
    )
  ) STORED;

CREATE INDEX concurrently "Post_search_idx" ON "Post"("search");

CREATE INDEX concurrently "User_search_idx" ON "User"("search");
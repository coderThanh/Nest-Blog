-- DropIndex
DROP INDEX "Category_search_idx";

-- DropIndex
DROP INDEX "Post_search_idx";

-- DropIndex
DROP INDEX "User_search_idx";

-- CreateIndex
CREATE INDEX CONCURRENTLY "Category_search_idx" ON "Category" USING GIN ("search" gin_trgm_ops);

-- CreateIndex
CREATE INDEX CONCURRENTLY "Post_search_idx" ON "Post" USING GIN ("search" gin_trgm_ops);

-- CreateIndex
CREATE INDEX CONCURRENTLY "User_search_idx" ON "User" USING GIN ("search" gin_trgm_ops);

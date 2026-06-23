-- CreateIndex
CREATE INDEX "Category_search_idx" ON "Category" USING GIN ("search" gin_trgm_ops);

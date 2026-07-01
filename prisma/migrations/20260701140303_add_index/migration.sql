-- DropIndex
DROP INDEX "Token_token_type_idx";

-- CreateIndex
CREATE INDEX CONCURRENTLY "File_createdBy_idx" ON "File"("createdBy");

-- CreateIndex
CREATE INDEX CONCURRENTLY "File_created_at_idx" ON "File"("created_at" DESC);

-- CreateIndex
CREATE INDEX CONCURRENTLY "Post_created_at_idx" ON "Post"("created_at" DESC);

-- CreateIndex
CREATE INDEX CONCURRENTLY "Post_created_by_idx" ON "Post"("created_by");

-- CreateIndex
CREATE INDEX CONCURRENTLY "Token_user_id_idx" ON "Token"("user_id");

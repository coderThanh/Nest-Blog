-- CreateIndex
CREATE INDEX CONCURRENTLY "Comment_parent_id_created_at_idx" ON "Comment"("parent_id", "created_at" DESC) WHERE ("parent_id" is not null);

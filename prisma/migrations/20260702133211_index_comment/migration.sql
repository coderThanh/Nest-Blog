-- DropIndex
DROP INDEX "Comment_reply_to_id_created_at_idx";

-- CreateIndex
CREATE INDEX "Comment_target_id_target_type_created_at_idx" ON "Comment"("target_id", "target_type", "created_at" DESC) WHERE ("parent_id" is null);

-- CreateIndex
CREATE INDEX "Comment_reply_to_id_created_at_idx" ON "Comment"("reply_to_id", "created_at" DESC) WHERE ("reply_to_id" is not null);

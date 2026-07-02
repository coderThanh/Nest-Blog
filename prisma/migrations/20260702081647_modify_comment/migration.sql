/*
  Warnings:

  - You are about to drop the column `path` on the `Comment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_parent_id_fkey";

-- DropIndex
DROP INDEX "Comment_path_created_at_idx";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "path",
ADD COLUMN     "reply_to_id" TEXT;

-- CreateIndex
CREATE INDEX "Comment_reply_to_id_created_at_idx" ON "Comment"("reply_to_id", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_reply_to_id_fkey" FOREIGN KEY ("reply_to_id") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

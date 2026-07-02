-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_parent_id_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "path" TEXT;

-- CreateIndex
CREATE INDEX "Comment_path_created_at_idx" ON "Comment"("path", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

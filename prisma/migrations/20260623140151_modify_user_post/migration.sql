/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_createdBy_fkey";

-- AlterTable
ALTER TABLE "Post" RENAME COLUMN  "createdBy" to "created_by";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "verified" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

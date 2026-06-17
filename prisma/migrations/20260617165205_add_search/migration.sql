/*
  Warnings:

  - A unique constraint covering the columns `[username,deleted_at]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_deleted_by_fkey";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "search" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "search" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_deleted_at_key" ON "User"("username", "deleted_at");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

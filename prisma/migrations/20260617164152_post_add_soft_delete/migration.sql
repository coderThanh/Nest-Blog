/*
  Warnings:

  - A unique constraint covering the columns `[email,deleted_at]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deleted_by` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_deleted_at_key" ON "User"("email", "deleted_at");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

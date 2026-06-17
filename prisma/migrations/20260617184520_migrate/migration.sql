/*
  Warnings:

  - You are about to drop the column `search` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `search` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Post_search_idx";

-- DropIndex
DROP INDEX "User_search_idx";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "search";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "search";

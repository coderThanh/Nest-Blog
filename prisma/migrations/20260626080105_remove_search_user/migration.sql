/*
 Warnings:
 
 - You are about to drop the column `search` on the `User` table. All the data in the column will be lost.
 
 */
-- DropIndex
DROP INDEX "User_search_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "search";

ALTER TABLE "User"
  RENAME COLUMN "search_new" TO "search";

CREATE INDEX CONCURRENTLY "User_search_idx" ON "User" USING gin ("search" gin_trgm_ops);
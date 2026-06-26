/*
  Warnings:

  - You are about to drop the column `isSystem` on the `Role` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Role" RENAME COLUMN "isSystem" to is_system;

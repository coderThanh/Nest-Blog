/*
 Warnings:
 
 - You are about to drop the column `verified` on the `User` table. All the data in the column will be lost.
 
 */
-- AlterTable
ALTER TABLE "User"
  RENAME COLUMN "verified" TO "verified_at";

ALTER TABLE "User"
ADD COLUMN "search_new" TEXT NOT NULL GENERATED ALWAYS AS (
    lower(
      immute_unaccent(name) || ' ' || COALESCE(phone, '') || ' ' || COALESCE(email, '') || ' ' || COALESCE(username, '')
    )
  ) STORED;
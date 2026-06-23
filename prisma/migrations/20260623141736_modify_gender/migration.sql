/*
  Warnings:

  - The `gender` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "GenderEnum" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "gender" TYPE "GenderEnum" USING "gender"::text::"GenderEnum";

-- DropEnum
DROP TYPE "Gender";

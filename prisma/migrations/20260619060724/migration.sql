/*
  Warnings:

  - A unique constraint covering the columns `[provider_id,provider_public_id]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "provider_public_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "File_provider_id_provider_public_id_key" ON "File"("provider_id", "provider_public_id") WHERE (provider_public_id is not null);

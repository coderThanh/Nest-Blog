/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `parent_id` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `_PostToCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `A` on the `_PostToCategory` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `_PostToCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `B` on the `_PostToCategory` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT IF EXISTS "Category_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "_PostToCategory" DROP CONSTRAINT IF EXISTS "_PostToCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostToCategory" DROP CONSTRAINT IF EXISTS "_PostToCategory_B_fkey";

-- AlterTable Category
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
  ALTER COLUMN "id" SET DATA TYPE INTEGER,
  ALTER COLUMN "parent_id" SET DATA TYPE INTEGER,
  ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");

-- Update Category Sequence
SELECT setval(pg_get_serial_sequence('"Category"', 'id'), coalesce(max(id), 0) + 1, false) FROM "Category";

-- AlterTable Post
ALTER TABLE "Post" DROP CONSTRAINT "Post_pkey",
  ALTER COLUMN "id" SET DATA TYPE INTEGER,
  ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("id");

-- Update Post Sequence
SELECT setval(pg_get_serial_sequence('"Post"', 'id'), coalesce(max(id), 0) + 1, false) FROM "Post";

-- AlterTable _PostToCategory
ALTER TABLE "_PostToCategory" DROP CONSTRAINT "_PostToCategory_AB_pkey",
  ALTER COLUMN "A" SET DATA TYPE INTEGER,
  ALTER COLUMN "B" SET DATA TYPE INTEGER,
  ADD CONSTRAINT "_PostToCategory_AB_pkey" PRIMARY KEY ("A", "B");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToCategory" ADD CONSTRAINT "_PostToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToCategory" ADD CONSTRAINT "_PostToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
 Warnings:
 
 - The values [ANY] on the enum `PermissionScope` will be removed. If these variants are still used in the database, this will fail.
 
 */
-- AlterEnum
BEGIN;

-- 1. Tạo type mới với các giá trị mong muốn
CREATE TYPE "PermissionScope_new" AS ENUM ('OWN', 'SYSTEM');

-- 2. Chuyển đổi cột và mapping dữ liệu cũ sang mới trong một bước
ALTER TABLE "RolePermission"
ALTER COLUMN "scope" TYPE "PermissionScope_new" USING (
    CASE
      WHEN "scope"::text = 'ANY' THEN 'SYSTEM'::"PermissionScope_new"
      ELSE "scope"::text::"PermissionScope_new"
    END
  );

-- 3. Đổi tên type mới thành tên chính thức
ALTER TYPE "PermissionScope"
RENAME TO "PermissionScope_old";

ALTER TYPE "PermissionScope_new"
RENAME TO "PermissionScope";

-- 4. Xóa type cũ
DROP TYPE "PermissionScope_old";

COMMIT;
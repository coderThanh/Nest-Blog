/*
  Warnings:

  - A unique constraint covering the columns `[email,deleted_at]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username,deleted_at]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_email_deleted_at_key";

-- DropIndex
DROP INDEX "User_username_deleted_at_key";

-- CreateIndex
CREATE UNIQUE INDEX "User_email_deleted_at_key" ON "User"("email", "deleted_at") WHERE ("deleted_at" is null);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_deleted_at_key" ON "User"("username", "deleted_at") WHERE ("deleted_at" is null);

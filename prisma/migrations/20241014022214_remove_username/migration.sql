/*
  Warnings:

  - You are about to drop the column `userName` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_username_key";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "userName";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "username";

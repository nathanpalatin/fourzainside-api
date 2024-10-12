/*
  Warnings:

  - You are about to drop the column `referenceId` on the `chats` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_referenceId_fkey";

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "referenceId";

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

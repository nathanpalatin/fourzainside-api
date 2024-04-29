/*
  Warnings:

  - You are about to drop the column `usersId` on the `messages` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_usersId_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "usersId";

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sendUserId_fkey" FOREIGN KEY ("sendUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

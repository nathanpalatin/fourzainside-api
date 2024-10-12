/*
  Warnings:

  - You are about to drop the column `referenceId` on the `followers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "followers" DROP CONSTRAINT "followers_referenceId_fkey";

-- AlterTable
ALTER TABLE "chats" ALTER COLUMN "userId" DROP DEFAULT,
ALTER COLUMN "chatWithId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "followers" DROP COLUMN "referenceId",
ALTER COLUMN "userId" DROP DEFAULT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "followingId" DROP DEFAULT,
ALTER COLUMN "followingId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "sendUserId" DROP DEFAULT,
ALTER COLUMN "receiveUserId" DROP DEFAULT,
ALTER COLUMN "userName" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

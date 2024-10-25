/*
  Warnings:

  - You are about to drop the `_CoursesToUsers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CoursesToUsers" DROP CONSTRAINT "_CoursesToUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_CoursesToUsers" DROP CONSTRAINT "_CoursesToUsers_B_fkey";

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_CoursesToUsers";

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

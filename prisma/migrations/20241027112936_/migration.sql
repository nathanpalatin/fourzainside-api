/*
  Warnings:

  - A unique constraint covering the columns `[userId,lessonId]` on the table `progress` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "progress" ADD COLUMN     "watched" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "progress_userId_lessonId_key" ON "progress"("userId", "lessonId");

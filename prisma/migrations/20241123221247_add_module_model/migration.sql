/*
  Warnings:

  - You are about to drop the column `banner` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `classification` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `lessons` table. All the data in the column will be lost.
  - Added the required column `moduleId` to the `lessons` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_courseId_fkey";

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "banner";

-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "classification",
DROP COLUMN "duration",
ADD COLUMN     "moduleId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "modules" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

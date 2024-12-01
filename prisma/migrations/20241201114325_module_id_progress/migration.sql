/*
  Warnings:

  - Added the required column `moduleId` to the `progress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "progress" ADD COLUMN     "moduleId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "progress" ADD CONSTRAINT "progress_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

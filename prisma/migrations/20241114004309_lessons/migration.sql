/*
  Warnings:

  - You are about to drop the column `watched` on the `lessons` table. All the data in the column will be lost.
  - Made the column `transcription` on table `lessons` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "watched",
ALTER COLUMN "transcription" SET NOT NULL;

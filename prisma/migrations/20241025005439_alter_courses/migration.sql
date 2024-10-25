/*
  Warnings:

  - Added the required column `duration` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `courses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "level" TEXT NOT NULL DEFAULT 'easy',
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

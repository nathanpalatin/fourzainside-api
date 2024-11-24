/*
  Warnings:

  - You are about to drop the column `avaliable` on the `modules` table. All the data in the column will be lost.
  - Added the required column `available` to the `modules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "modules" DROP COLUMN "avaliable",
ADD COLUMN     "available" TEXT NOT NULL,
ALTER COLUMN "visibility" DROP DEFAULT;

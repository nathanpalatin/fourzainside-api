/*
  Warnings:

  - You are about to drop the column `image` on the `modules` table. All the data in the column will be lost.
  - Added the required column `avaliable` to the `modules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visibility` to the `modules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "modules" DROP COLUMN "image",
ADD COLUMN     "avaliable" TEXT NOT NULL,
ADD COLUMN     "visibility" BOOLEAN NOT NULL;

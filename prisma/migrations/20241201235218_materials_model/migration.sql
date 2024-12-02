/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `materials` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "materials" DROP COLUMN "updatedAt",
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

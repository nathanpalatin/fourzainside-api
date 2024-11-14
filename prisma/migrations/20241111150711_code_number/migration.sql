/*
  Warnings:

  - You are about to drop the column `createdAt` on the `validation_code` table. All the data in the column will be lost.
  - Changed the type of `code` on the `validation_code` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "validation_code" DROP COLUMN "createdAt",
DROP COLUMN "code",
ADD COLUMN     "code" INTEGER NOT NULL;

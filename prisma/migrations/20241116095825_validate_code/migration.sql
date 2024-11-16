/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `validation_code` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `validation_code` table. All the data in the column will be lost.
  - Added the required column `email` to the `validation_code` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "validation_code" DROP CONSTRAINT "validation_code_userId_fkey";

-- AlterTable
ALTER TABLE "validation_code" DROP COLUMN "expiresAt",
DROP COLUMN "userId",
ADD COLUMN     "email" TEXT NOT NULL;

/*
  Warnings:

  - You are about to drop the column `occupation` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `users` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "request_signup" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "occupation",
DROP COLUMN "state",
ADD COLUMN     "complement" TEXT,
ADD COLUMN     "international" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "neighborhood" TEXT,
ADD COLUMN     "number" TEXT,
ADD COLUMN     "street" TEXT,
ADD COLUMN     "uf" TEXT;

-- CreateTable
CREATE TABLE "social_links" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "social_links_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "social_links" ADD CONSTRAINT "social_links_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

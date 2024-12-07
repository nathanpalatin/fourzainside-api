/*
  Warnings:

  - You are about to drop the `Ensigns` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ensigns" DROP CONSTRAINT "Ensigns_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Ensigns" DROP CONSTRAINT "Ensigns_userId_fkey";

-- DropTable
DROP TABLE "Ensigns";

-- CreateTable
CREATE TABLE "ensigns" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ensigns_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ensigns" ADD CONSTRAINT "ensigns_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ensigns" ADD CONSTRAINT "ensigns_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

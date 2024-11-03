-- AlterTable
ALTER TABLE "course_enrollments" ADD COLUMN     "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

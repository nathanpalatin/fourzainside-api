/*
  Warnings:

  - You are about to drop the column `session_id` on the `transactions` table. All the data in the column will be lost.
  - The `emailVerified` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "session_id";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "emailVerified",
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false;

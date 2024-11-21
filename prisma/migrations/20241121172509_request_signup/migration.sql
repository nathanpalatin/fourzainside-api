-- CreateEnum
CREATE TYPE "TypeUser" AS ENUM ('PERSONAL', 'COMPANY');

-- CreateTable
CREATE TABLE "request_signup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "type" "TypeUser" NOT NULL DEFAULT 'PERSONAL',
    "call" TEXT,

    CONSTRAINT "request_signup_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "lessons" ALTER COLUMN "transcription" DROP NOT NULL;

-- CreateTable
CREATE TABLE "reset_passwords" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "reset_passwords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reset_passwords_token_key" ON "reset_passwords"("token");

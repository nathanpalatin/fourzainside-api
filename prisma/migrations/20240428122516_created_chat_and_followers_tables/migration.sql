-- CreateTable
CREATE TABLE "followers" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL DEFAULT 0,
    "followingId" INTEGER NOT NULL DEFAULT 0,
    "referenceId" TEXT,

    CONSTRAINT "followers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL DEFAULT 0,
    "chatWithId" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "referenceId" TEXT,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_referenceId_fkey" FOREIGN KEY ("referenceId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_referenceId_fkey" FOREIGN KEY ("referenceId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

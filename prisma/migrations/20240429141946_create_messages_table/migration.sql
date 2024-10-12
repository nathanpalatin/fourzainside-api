-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "sendUserId" INTEGER NOT NULL DEFAULT 0,
    "receiveUserId" INTEGER NOT NULL DEFAULT 0,
    "userName" TEXT NOT NULL DEFAULT '',
    "messageText" TEXT NOT NULL,
    "messageType" TEXT NOT NULL,
    "file" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "usersId" TEXT,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

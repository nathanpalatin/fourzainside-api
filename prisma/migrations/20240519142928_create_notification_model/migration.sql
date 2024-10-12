-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "notificationType" TEXT NOT NULL,
    "sendUserId" TEXT,
    "receiveUserId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unread',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "usersId" TEXT,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_receiveUserId_fkey" FOREIGN KEY ("receiveUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "chatsId" TEXT;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatsId_fkey" FOREIGN KEY ("chatsId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

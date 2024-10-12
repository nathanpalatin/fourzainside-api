-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_sendUserId_fkey" FOREIGN KEY ("sendUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

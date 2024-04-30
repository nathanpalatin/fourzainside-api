-- AlterTable
ALTER TABLE "medias" ADD COLUMN     "postId" TEXT;

-- AddForeignKey
ALTER TABLE "medias" ADD CONSTRAINT "medias_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

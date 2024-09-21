-- DropForeignKey
ALTER TABLE "medias" DROP CONSTRAINT "medias_postId_fkey";

-- AddForeignKey
ALTER TABLE "medias" ADD CONSTRAINT "medias_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

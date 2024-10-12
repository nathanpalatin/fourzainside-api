-- CreateTable
CREATE TABLE "medias" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'FILE',
    "source" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "medias_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "medias" ADD CONSTRAINT "medias_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "Watch" DROP CONSTRAINT "Watch_mediaId_fkey";

-- AddForeignKey
ALTER TABLE "Watch" ADD CONSTRAINT "Watch_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("tmdbId") ON DELETE CASCADE ON UPDATE CASCADE;

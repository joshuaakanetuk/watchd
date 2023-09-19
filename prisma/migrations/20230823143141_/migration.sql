/*
  Warnings:

  - A unique constraint covering the columns `[tmdbId]` on the table `Media` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mediaId` to the `Watch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Watch" ADD COLUMN     "mediaId" TEXT NOT NULL,
ALTER COLUMN "dateStarted" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Media_tmdbId_key" ON "Media"("tmdbId");

-- AddForeignKey
ALTER TABLE "Watch" ADD CONSTRAINT "Watch_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("tmdbId") ON DELETE RESTRICT ON UPDATE CASCADE;

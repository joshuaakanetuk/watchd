/*
  Warnings:

  - Added the required column `tmdbId` to the `NowPlaying` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NowPlaying" ADD COLUMN     "tmdbId" TEXT NOT NULL;

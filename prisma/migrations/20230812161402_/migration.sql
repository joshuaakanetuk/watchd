/*
  Warnings:

  - You are about to drop the column `runtime` on the `NowPlaying` table. All the data in the column will be lost.
  - You are about to drop the column `tagline` on the `NowPlaying` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "NowPlaying" DROP COLUMN "runtime",
DROP COLUMN "tagline";

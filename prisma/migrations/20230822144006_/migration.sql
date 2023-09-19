-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "cast" JSONB,
ADD COLUMN     "creator" TEXT,
ADD COLUMN     "crew" JSONB;

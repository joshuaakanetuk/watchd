/*
  Warnings:

  - The `cast` column on the `Media` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `crew` column on the `Media` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Media" DROP COLUMN "cast",
ADD COLUMN     "cast" JSONB,
DROP COLUMN "crew",
ADD COLUMN     "crew" JSONB;

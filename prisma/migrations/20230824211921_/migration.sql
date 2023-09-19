-- AlterTable
ALTER TABLE "List" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "listId" TEXT;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE SET NULL ON UPDATE CASCADE;

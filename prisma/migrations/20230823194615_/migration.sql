/*
  Warnings:

  - Made the column `eventoId` on table `Nfts` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Nfts" DROP CONSTRAINT "Nfts_eventoId_fkey";

-- AlterTable
ALTER TABLE "Nfts" ALTER COLUMN "eventoId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Nfts" ADD CONSTRAINT "Nfts_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

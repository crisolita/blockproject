-- AlterTable
ALTER TABLE "Nfts" ADD COLUMN     "eventoId" INTEGER;

-- AddForeignKey
ALTER TABLE "Nfts" ADD CONSTRAINT "Nfts_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Eventos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

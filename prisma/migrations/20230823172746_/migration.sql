-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Eventos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

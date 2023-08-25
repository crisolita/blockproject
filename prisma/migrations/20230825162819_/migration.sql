/*
  Warnings:

  - A unique constraint covering the columns `[qrCode]` on the table `Entrada` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Entrada_qrCode_key" ON "Entrada"("qrCode");

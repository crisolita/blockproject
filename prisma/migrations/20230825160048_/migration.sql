/*
  Warnings:

  - A unique constraint covering the columns `[nftId]` on the table `Entrada` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Entrada_nftId_key" ON "Entrada"("nftId");

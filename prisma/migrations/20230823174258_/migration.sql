/*
  Warnings:

  - A unique constraint covering the columns `[nftId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "orders_nftId_key" ON "orders"("nftId");

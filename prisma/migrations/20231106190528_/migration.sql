/*
  Warnings:

  - Made the column `eventoId` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_eventoId_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "eventoId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

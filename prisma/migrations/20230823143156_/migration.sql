/*
  Warnings:

  - You are about to drop the column `imageIpfs` on the `Nfts` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `Nfts` table. All the data in the column will be lost.
  - You are about to drop the column `royalty` on the `Nfts` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TicketTime" AS ENUM ('Entrada', 'Cupon');

-- AlterTable
ALTER TABLE "Nfts" DROP COLUMN "imageIpfs",
DROP COLUMN "nombre",
DROP COLUMN "royalty",
ADD COLUMN     "tipo" "TicketTime";

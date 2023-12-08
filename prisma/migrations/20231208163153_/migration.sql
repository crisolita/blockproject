/*
  Warnings:

  - You are about to drop the column `active` on the `orders` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "StatusOrder" AS ENUM ('venta_activa', 'pago_pendiente', 'vendido');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "charge_enable" BOOLEAN;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "active",
ADD COLUMN     "checkout_id" TEXT,
ADD COLUMN     "status" "StatusOrder";

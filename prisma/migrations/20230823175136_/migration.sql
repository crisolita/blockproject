-- DropIndex
DROP INDEX "orders_nftId_key";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "completedAt" TEXT;

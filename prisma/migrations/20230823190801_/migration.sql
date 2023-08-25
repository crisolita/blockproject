/*
  Warnings:

  - The `completedAt` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "completedAt",
ADD COLUMN     "completedAt" TIMESTAMP(3);

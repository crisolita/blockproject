/*
  Warnings:

  - The `license_required` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "license_required",
ADD COLUMN     "license_required" DOUBLE PRECISION;

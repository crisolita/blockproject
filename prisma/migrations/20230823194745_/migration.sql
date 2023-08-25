/*
  Warnings:

  - Made the column `nftId` on table `Entrada` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Entrada" ADD COLUMN     "used" BOOLEAN,
ALTER COLUMN "nftId" SET NOT NULL;

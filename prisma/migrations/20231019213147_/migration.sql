/*
  Warnings:

  - Made the column `date` on table `Eventos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Eventos" ALTER COLUMN "date" SET NOT NULL;

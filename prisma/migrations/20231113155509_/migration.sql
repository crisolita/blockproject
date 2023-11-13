/*
  Warnings:

  - Made the column `dorsal` on table `Entrada` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Entrada" ALTER COLUMN "dorsal" SET NOT NULL;

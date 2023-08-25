/*
  Warnings:

  - The `date` column on the `Eventos` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Eventos" DROP COLUMN "date",
ADD COLUMN     "date" INTEGER;

/*
  Warnings:

  - You are about to drop the column `valid_at` on the `Entrada` table. All the data in the column will be lost.
  - The `date` column on the `Eventos` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `valid_start` to the `Entrada` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Entrada" DROP COLUMN "valid_at",
ADD COLUMN     "valid_start" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Eventos" DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3);

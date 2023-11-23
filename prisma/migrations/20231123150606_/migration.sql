/*
  Warnings:

  - You are about to drop the column `dni_passport` on the `userInfo` table. All the data in the column will be lost.
  - Added the required column `documento` to the `userInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero_documento` to the `userInfo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Documento" AS ENUM ('PASAPORTE', 'DNI');

-- AlterTable
ALTER TABLE "userInfo" DROP COLUMN "dni_passport",
ADD COLUMN     "documento" "Documento" NOT NULL,
ADD COLUMN     "numero_documento" TEXT NOT NULL;

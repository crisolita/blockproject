/*
  Warnings:

  - You are about to drop the column `birth_date` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `numero_de_licencia` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('MASCULINO', 'FEMENINO', 'OTROS');

-- CreateEnum
CREATE TYPE "Talla" AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XLL');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "birth_date",
DROP COLUMN "numero_de_licencia";

-- CreateTable
CREATE TABLE "userInfo" (
    "user_id" INTEGER NOT NULL,
    "dni_passport" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "gender" "Genero" NOT NULL,
    "numero_de_licencia" TEXT NOT NULL,
    "direccion_postal" TEXT NOT NULL,
    "talla_camisa" "Talla" NOT NULL,
    "club" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "userInfo_user_id_key" ON "userInfo"("user_id");

-- AddForeignKey
ALTER TABLE "userInfo" ADD CONSTRAINT "userInfo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

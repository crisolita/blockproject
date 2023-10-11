/*
  Warnings:

  - Added the required column `user_rol` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ROL" AS ENUM ('DEPORTISTA', 'ORGANIZADOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatusRequest" AS ENUM ('RECHAZADO', 'APROBADO');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "birth_date" TIMESTAMP(3),
ADD COLUMN     "company_cif" TEXT,
ADD COLUMN     "company_name" TEXT,
ADD COLUMN     "user_rol" "ROL" NOT NULL,
ALTER COLUMN "first_name" DROP NOT NULL,
ALTER COLUMN "last_name" DROP NOT NULL;

-- CreateTable
CREATE TABLE "RequestOrganizador" (
    "user_id" INTEGER NOT NULL,
    "status" "StatusRequest" NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "RequestOrganizador_user_id_key" ON "RequestOrganizador"("user_id");

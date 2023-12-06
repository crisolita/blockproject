/*
  Warnings:

  - You are about to drop the column `distancia_comprada` on the `Nfts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Nfts" DROP COLUMN "distancia_comprada";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "preguntasIds" INTEGER[];

-- CreateTable
CREATE TABLE "Preguntas" (
    "id" SERIAL NOT NULL,
    "pregunta" TEXT NOT NULL,
    "respuestas" TEXT[],

    CONSTRAINT "Preguntas_pkey" PRIMARY KEY ("id")
);

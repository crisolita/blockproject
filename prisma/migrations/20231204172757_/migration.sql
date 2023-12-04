/*
  Warnings:

  - You are about to drop the column `adicionales` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `codigo_descuento` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "adicionales",
DROP COLUMN "codigo_descuento";

-- CreateTable
CREATE TABLE "codigos_descuentos" (
    "cod" TEXT NOT NULL,
    "porcentaje" DOUBLE PRECISION NOT NULL,
    "veces_restantes" INTEGER NOT NULL,

    CONSTRAINT "codigos_descuentos_pkey" PRIMARY KEY ("cod")
);

-- CreateTable
CREATE TABLE "adicionales" (
    "id" SERIAL NOT NULL,
    "concepto" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "adicionales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_codigos_descuentosToorders" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_codigos_descuentosToorders_AB_unique" ON "_codigos_descuentosToorders"("A", "B");

-- CreateIndex
CREATE INDEX "_codigos_descuentosToorders_B_index" ON "_codigos_descuentosToorders"("B");

-- AddForeignKey
ALTER TABLE "_codigos_descuentosToorders" ADD CONSTRAINT "_codigos_descuentosToorders_A_fkey" FOREIGN KEY ("A") REFERENCES "codigos_descuentos"("cod") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_codigos_descuentosToorders" ADD CONSTRAINT "_codigos_descuentosToorders_B_fkey" FOREIGN KEY ("B") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

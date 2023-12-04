/*
  Warnings:

  - You are about to drop the column `orderId` on the `adicionales` table. All the data in the column will be lost.
  - You are about to drop the `_adicionalesToorders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_codigos_descuentosToorders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_adicionalesToorders" DROP CONSTRAINT "_adicionalesToorders_A_fkey";

-- DropForeignKey
ALTER TABLE "_adicionalesToorders" DROP CONSTRAINT "_adicionalesToorders_B_fkey";

-- DropForeignKey
ALTER TABLE "_codigos_descuentosToorders" DROP CONSTRAINT "_codigos_descuentosToorders_A_fkey";

-- DropForeignKey
ALTER TABLE "_codigos_descuentosToorders" DROP CONSTRAINT "_codigos_descuentosToorders_B_fkey";

-- AlterTable
ALTER TABLE "adicionales" DROP COLUMN "orderId";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "adicionalesIds" INTEGER[],
ADD COLUMN     "codigo_descuento" INTEGER[];

-- DropTable
DROP TABLE "_adicionalesToorders";

-- DropTable
DROP TABLE "_codigos_descuentosToorders";

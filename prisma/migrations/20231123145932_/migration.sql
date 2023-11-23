/*
  Warnings:

  - The values [XLL] on the enum `Talla` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Talla_new" AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL');
ALTER TABLE "userInfo" ALTER COLUMN "talla_camisa" TYPE "Talla_new" USING ("talla_camisa"::text::"Talla_new");
ALTER TYPE "Talla" RENAME TO "Talla_old";
ALTER TYPE "Talla_new" RENAME TO "Talla";
DROP TYPE "Talla_old";
COMMIT;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "codigo_descuento" TEXT;

-- AlterTable
ALTER TABLE "userInfo" ALTER COLUMN "numero_de_licencia" DROP NOT NULL;

/*
  Warnings:

  - The values [diez_km,cinco_km] on the enum `Modales` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `name` on table `Eventos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modalidad` on table `Eventos` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "SubCategorias" AS ENUM ('KM_5', 'KM_10', 'Media_maraton_21km', 'Maraton_42km', 'Sprint', 'Olimpico', 'Half', 'Full', 'Ruta', 'Montanbike_MTB', 'Gravel');

-- AlterEnum
BEGIN;
CREATE TYPE "Modales_new" AS ENUM ('Thriatlon', 'Running', 'Ciclismo');
ALTER TABLE "Eventos" ALTER COLUMN "modalidad" TYPE "Modales_new" USING ("modalidad"::text::"Modales_new");
ALTER TYPE "Modales" RENAME TO "Modales_old";
ALTER TYPE "Modales_new" RENAME TO "Modales";
DROP TYPE "Modales_old";
COMMIT;

-- AlterTable
ALTER TABLE "Eventos" ADD COLUMN     "subcategoria" "SubCategorias",
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "modalidad" SET NOT NULL;

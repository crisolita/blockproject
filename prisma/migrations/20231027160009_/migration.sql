/*
  Warnings:

  - The values [Thriatlon] on the enum `Modales` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Modales_new" AS ENUM ('Triathlon', 'Running', 'Ciclismo');
ALTER TABLE "Eventos" ALTER COLUMN "modalidad" TYPE "Modales_new" USING ("modalidad"::text::"Modales_new");
ALTER TYPE "Modales" RENAME TO "Modales_old";
ALTER TYPE "Modales_new" RENAME TO "Modales";
DROP TYPE "Modales_old";
COMMIT;

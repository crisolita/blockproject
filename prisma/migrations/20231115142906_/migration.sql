/*
  Warnings:

  - The values [ADMIN] on the enum `ROL` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ROL_new" AS ENUM ('DEPORTISTA', 'ORGANIZADOR');
ALTER TABLE "User" ALTER COLUMN "user_rol" TYPE "ROL_new" USING ("user_rol"::text::"ROL_new");
ALTER TYPE "ROL" RENAME TO "ROL_old";
ALTER TYPE "ROL_new" RENAME TO "ROL";
DROP TYPE "ROL_old";
COMMIT;

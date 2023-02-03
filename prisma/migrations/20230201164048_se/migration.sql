/*
  Warnings:

  - You are about to drop the `second` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "keys" ADD COLUMN     "second" TEXT;

-- DropTable
DROP TABLE "second";

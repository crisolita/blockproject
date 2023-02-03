/*
  Warnings:

  - The primary key for the `second` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `second` table. All the data in the column will be lost.
  - Added the required column `email` to the `second` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "second" DROP CONSTRAINT "second_pkey",
DROP COLUMN "id",
ADD COLUMN     "email" TEXT NOT NULL,
ALTER COLUMN "key" DROP NOT NULL,
ADD CONSTRAINT "second_pkey" PRIMARY KEY ("email");

/*
  Warnings:

  - You are about to drop the column `typeOfUser` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[googleID]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "typeOfUser",
ADD COLUMN     "googleID" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_googleID_key" ON "User"("googleID");

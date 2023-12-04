/*
  Warnings:

  - Made the column `User_id` on table `Nfts` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Nfts" DROP CONSTRAINT "Nfts_User_id_fkey";

-- AlterTable
ALTER TABLE "Nfts" ALTER COLUMN "User_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Nfts" ADD CONSTRAINT "Nfts_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

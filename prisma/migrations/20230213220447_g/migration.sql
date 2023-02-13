/*
  Warnings:

  - Added the required column `User_id` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "User_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

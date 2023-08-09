/*
  Warnings:

  - You are about to drop the column `User_id` on the `orders` table. All the data in the column will be lost.
  - Added the required column `sellerID` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_User_id_fkey";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "User_id",
ADD COLUMN     "buyerId" INTEGER,
ADD COLUMN     "sellerID" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_sellerID_fkey" FOREIGN KEY ("sellerID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

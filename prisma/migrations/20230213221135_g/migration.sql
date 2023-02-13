/*
  Warnings:

  - You are about to drop the `Orders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_User_id_fkey";

-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_nftId_fkey";

-- DropTable
DROP TABLE "Orders";

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "User_id" INTEGER NOT NULL,
    "nftId" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "Nfts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

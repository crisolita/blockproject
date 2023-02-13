-- CreateTable
CREATE TABLE "Orders" (
    "id" SERIAL NOT NULL,
    "nftId" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nfts" (
    "User_id" INTEGER,
    "id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "royalty" INTEGER NOT NULL,
    "imageIpfs" TEXT NOT NULL,

    CONSTRAINT "Nfts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "balance" INTEGER,
    "email" TEXT,
    "password" TEXT,
    "wallet" TEXT,
    "authToken" TEXT,
    "typeOfUser" TEXT NOT NULL,
    "key" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Nfts_id_key" ON "Nfts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "Nfts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nfts" ADD CONSTRAINT "Nfts_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "keys" (
    "id" SERIAL NOT NULL,
    "wallet" TEXT NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "second" (
    "id" INTEGER NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "second_pkey" PRIMARY KEY ("id")
);

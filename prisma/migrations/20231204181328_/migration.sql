-- AlterTable
ALTER TABLE "adicionales" ADD COLUMN     "orderId" INTEGER[];

-- CreateTable
CREATE TABLE "_adicionalesToorders" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_adicionalesToorders_AB_unique" ON "_adicionalesToorders"("A", "B");

-- CreateIndex
CREATE INDEX "_adicionalesToorders_B_index" ON "_adicionalesToorders"("B");

-- AddForeignKey
ALTER TABLE "_adicionalesToorders" ADD CONSTRAINT "_adicionalesToorders_A_fkey" FOREIGN KEY ("A") REFERENCES "adicionales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_adicionalesToorders" ADD CONSTRAINT "_adicionalesToorders_B_fkey" FOREIGN KEY ("B") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

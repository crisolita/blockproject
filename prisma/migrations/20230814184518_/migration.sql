-- CreateEnum
CREATE TYPE "Modales" AS ENUM ('Thriatlon', 'diez_km', 'cinco_km');

-- CreateTable
CREATE TABLE "Eventos" (
    "id" SERIAL NOT NULL,
    "creator_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "modalidad" "Modales",
    "profile_image" TEXT,
    "banner_image" TEXT,
    "instagram" TEXT,
    "twitter" TEXT,
    "facebook" TEXT,

    CONSTRAINT "Eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entrada" (
    "id" SERIAL NOT NULL,
    "qrCode" TEXT,
    "user_id" INTEGER NOT NULL,
    "evento_id" INTEGER NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL,
    "expire_at" TIMESTAMP(3) NOT NULL,
    "valid_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entrada_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Eventos" ADD CONSTRAINT "Eventos_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrada" ADD CONSTRAINT "Entrada_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrada" ADD CONSTRAINT "Entrada_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "Eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

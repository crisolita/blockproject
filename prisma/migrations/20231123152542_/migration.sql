-- CreateEnum
CREATE TYPE "Modales" AS ENUM ('Triathlon', 'Running', 'Ciclismo');

-- CreateEnum
CREATE TYPE "TicketTime" AS ENUM ('Entrada', 'Cupon');

-- CreateEnum
CREATE TYPE "ROL" AS ENUM ('DEPORTISTA', 'ORGANIZADOR');

-- CreateEnum
CREATE TYPE "StatusRequest" AS ENUM ('RECHAZADO', 'APROBADO', 'PENDIENTE');

-- CreateEnum
CREATE TYPE "SubCategorias" AS ENUM ('KM_5', 'KM_10', 'Media_maraton_21km', 'Maraton_42km', 'Sprint', 'Olimpico', 'Half', 'Full', 'Ruta', 'Montanbike_MTB', 'Gravel');

-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('MASCULINO', 'FEMENINO', 'OTROS');

-- CreateEnum
CREATE TYPE "Talla" AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL');

-- CreateEnum
CREATE TYPE "Documento" AS ENUM ('PASAPORTE', 'DNI');

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "sellerID" INTEGER NOT NULL,
    "buyerId" INTEGER,
    "nftId" INTEGER NOT NULL,
    "eventoId" INTEGER NOT NULL,
    "active" BOOLEAN,
    "txHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "precio_usado" DOUBLE PRECISION,
    "adicionales" TEXT,
    "adicionalesUsados" TEXT,
    "precio_batch" TEXT NOT NULL,
    "codigo_descuento" TEXT,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketplaceConfig" (
    "id" SERIAL NOT NULL,
    "royalty" DOUBLE PRECISION,

    CONSTRAINT "MarketplaceConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nfts" (
    "User_id" INTEGER,
    "id" INTEGER NOT NULL,
    "tipo" "TicketTime",
    "eventoId" INTEGER NOT NULL,
    "txHash" TEXT,
    "caducidadVenta" TIMESTAMP(3),
    "caducidadCanjeo" TIMESTAMP(3),
    "marketplace" BOOLEAN,
    "dorsal" TEXT,

    CONSTRAINT "Nfts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "balance" INTEGER,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "wallet" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "authToken" TEXT,
    "acctStpId" TEXT,
    "clientSecret" TEXT,
    "tokenValidUntil" TIMESTAMP(3),
    "googleID" TEXT,
    "user_rol" "ROL" NOT NULL,
    "company_name" TEXT,
    "company_cif" TEXT,
    "descripcion" TEXT,
    "foto_perfil" TEXT,
    "instagram" TEXT,
    "twitter" TEXT,
    "facebook" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userInfo" (
    "user_id" INTEGER NOT NULL,
    "documento" "Documento" NOT NULL,
    "numero_documento" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "gender" "Genero" NOT NULL,
    "numero_de_licencia" TEXT,
    "direccion_postal" TEXT NOT NULL,
    "talla_camisa" "Talla" NOT NULL,
    "club" TEXT
);

-- CreateTable
CREATE TABLE "RequestOrganizador" (
    "user_id" INTEGER NOT NULL,
    "status" "StatusRequest" NOT NULL
);

-- CreateTable
CREATE TABLE "Eventos" (
    "id" SERIAL NOT NULL,
    "creator_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "place" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "distancia" INTEGER,
    "modalidad" "Modales" NOT NULL,
    "subcategoria" "SubCategorias",
    "profile_image" TEXT,
    "banner_image" TEXT,
    "instagram" TEXT,
    "twitter" TEXT,
    "facebook" TEXT,
    "fecha_inicio_venta" TIMESTAMP(3),
    "fecha_final_venta" TIMESTAMP(3),
    "fecha_asignacion" TIMESTAMP(3),
    "descripcion" TEXT,

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
    "valid_start" TIMESTAMP(3) NOT NULL,
    "dorsal" TEXT NOT NULL,
    "nftId" INTEGER NOT NULL,
    "used" BOOLEAN,
    "burnHash" TEXT,

    CONSTRAINT "Entrada_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Nfts_id_key" ON "Nfts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_wallet_key" ON "User"("wallet");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleID_key" ON "User"("googleID");

-- CreateIndex
CREATE UNIQUE INDEX "userInfo_user_id_key" ON "userInfo"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "RequestOrganizador_user_id_key" ON "RequestOrganizador"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Entrada_qrCode_key" ON "Entrada"("qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "Entrada_nftId_key" ON "Entrada"("nftId");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_sellerID_fkey" FOREIGN KEY ("sellerID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "Nfts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nfts" ADD CONSTRAINT "Nfts_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nfts" ADD CONSTRAINT "Nfts_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userInfo" ADD CONSTRAINT "userInfo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eventos" ADD CONSTRAINT "Eventos_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrada" ADD CONSTRAINT "Entrada_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrada" ADD CONSTRAINT "Entrada_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "Eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

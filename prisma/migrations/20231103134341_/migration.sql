-- AlterTable
ALTER TABLE "Eventos" ADD COLUMN     "fecha_asignacion" TIMESTAMP(3),
ADD COLUMN     "fecha_final_venta" TIMESTAMP(3),
ADD COLUMN     "fecha_inicio_venta" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Nfts" ADD COLUMN     "caducidadCanjeo" TIMESTAMP(3),
ADD COLUMN     "caducidadVenta" TIMESTAMP(3),
ADD COLUMN     "marketplace" BOOLEAN;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "precio_batch" JSONB[];

-- CreateTable
CREATE TABLE "MarketplaceConfig" (
    "id" SERIAL NOT NULL,
    "royalty" DOUBLE PRECISION,

    CONSTRAINT "MarketplaceConfig_pkey" PRIMARY KEY ("id")
);

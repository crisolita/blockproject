import { Modales, PrismaClient } from "@prisma/client";

export const getEntradaByNFTID= async (
  id: number,
  prisma: PrismaClient
) => {
  return await prisma.entrada.findUnique({where: {nftId:id}})
};
export const getEntradaByEventoID= async (
  id: number,
  prisma: PrismaClient
) => {
  return await prisma.entrada.findMany({where: {evento_id:id}})
};
import { PrismaClient } from "@prisma/client";

export const getNftsForOrder = async (id: string, userId:string,cantidad:number, prisma: PrismaClient) => {
  const nft=await prisma.nfts.findUnique({
    where: { id: Number(id)},
  });
  if(nft?.User_id===Number(userId) && nft.cantidad>=cantidad) return nft;
  };
 
  export const getNftsById = async (id: string, prisma: PrismaClient) => {
    return await prisma.nfts.findUnique({
      where: { id: Number(id)},
    });
    };
    export const getOrder = async (id: string, prisma: PrismaClient) => {
      return await prisma.orders.findUnique({
        where: { id: Number(id)},
      });
      };

    
  

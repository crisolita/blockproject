import { PrismaClient, StatusOrder } from "@prisma/client";

export const getNftsForOrder = async (id: string, userId:string, prisma: PrismaClient) => {
  const nft=await prisma.nfts.findUnique({
    where: { id: Number(id)},
  });
  if(nft?.User_id===Number(userId) ) return nft;
  };
 
  export const getNftsById = async (id: number, prisma: PrismaClient) => {
    return await prisma.nfts.findUnique({
      where: { id},
    });
    };
    export const getOrder = async (id: string, prisma: PrismaClient) => {
      return await prisma.orders.findUnique({
        where: { id: Number(id)},
      });
      };
      export const getIfOrderIsActive= async (id: string, prisma: PrismaClient) => {
       let orders=await prisma.orders.findMany({
          where: { nftId: Number(id)},
        });
        let actives= orders.filter((x)=>
        {
          return x.status=='venta_activa'
        })
        if(actives.length==0) return false
        };
        export const createOrder= async (data:{sellerID:number,
          nftId:number,
          eventoId:number,
          precio_batch:string,
          status:StatusOrder,
          createdAt:Date,
          license_required?:number,
          codigo_descuento?:string[],
          preguntasIds?:number[],
          adicionalesIds?:number[]}, prisma: PrismaClient) => {
            return await prisma.orders.create({
              data: {
                ...data
              },
            })
           };

    
  
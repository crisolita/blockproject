import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
  getUserById,
} from "../service/user";
import contract, {  wallet } from "../service/web3";
import {  getIfOrderIsActive, getNftsForOrder, getOrder } from "../service/marketplace";
import { createCharge } from "../service/stripe";
import { getEventoById } from "../service/evento";
export const sellNFT = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
      // @ts-ignore
      const USER = req.user as User;
    const { nftId,price } = req?.body;
    const user = await getUserById(USER.id,prisma)
    const nft = await getNftsForOrder(nftId,USER.id,prisma);
    const order= await getIfOrderIsActive(nftId,prisma)
    const owner= await contract.functions.ownerOf(nftId)

    if (!order) return res.status(400).json({error: `NFT ya esta a la venta`})

    if (nft && owner[0]===user?.wallet ) {
      await prisma.orders.create({
        data: {
          sellerID:Number(USER.id),
          nftId:nft.id,
          price:Number(price),
          active:true,
          createdAt: new Date()
        },
      })
      res.json(({data:"ORDEN CREADA"}));

    } else  {
      res.json(({data:"No NFT found!!"}));

    }
  } catch (error) {
    console.log(error)
    res.json(({ error }));
  }
};
export const buyNFT = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
     // @ts-ignore
     const USER = req.user as User;
    const { orderId,cardNumber,exp_month,exp_year,cvc} = req?.body;
    const order = await getOrder(orderId,prisma)
    const buyer= await getUserById(USER.id,prisma)
    console.log(order)
    if(order?.buyerId || order?.completedAt || !order?.active || order.sellerID==buyer?.id) return res.json({error:"Order esta completa"})
    if(buyer && buyer.wallet) {
      const seller= await getUserById(order?.sellerID,prisma)
      //VALIDAR EL PAGO
      //  Hacer transferFrom 
      if(seller && seller.acctStpId && buyer.id) {
        const charge=await createCharge(buyer.id,seller.acctStpId,cardNumber,exp_month,exp_year,cvc,(order.price*100).toString(),prisma)
        if(!charge) return res.json({error:"PAgo con tarjeta ha fallado"})
        const transferFrom= await contract.connect(wallet).functions.transferFrom(seller.wallet,buyer.wallet,order.nftId)
        await prisma.orders.update({
          where: { id: Number(order.id) },
          data: {
            active: false,
            txHash:transferFrom.hash,
            buyerId:buyer.id,
            completedAt:new Date()
          },
        })
        await prisma.nfts.update({
          where:{id:order.nftId}, data:{
            User_id:buyer.id,
            txHash:transferFrom.hash
          }
        })
        return res.json(({data:{orderId:orderId,txHash:transferFrom.hash,buyerId:buyer.id,sellerId:seller.id,price:order.price}}));
      } else return res.json({error: "Vendedor no valido"})
      
      //Cambiar los nfts en la base de datos
      // const balance= await contract.functions.balanceOf(user?.wallet,nftId);
      //TRASPASAR EL PAGO O LA OPCION QUE SEA
    } else  {
      return res.json(({error:"ORDEN  NO ENCONTRADA"}));
    }

  } catch (error) {
    console.log(error)
    res.json({ error:error});
  }
};
export const createAndSellNFT = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
     // @ts-ignore
     const USER = req.user as User;
    const { cantidad,eventoId,tipo,price } = req?.body;
    const user= await getUserById(USER.id,prisma);
    ///VALIDACION DE QUE ESTE USUARIO HAYA PAGADO
    const event= await getEventoById(eventoId,prisma)
    if(!event) return res.status(404).json({error:"No event found"})
    if(user && user.wallet) {
      ///mint NFT
      let nftIDs:number[]=[];
        const nftId= await contract.connect(wallet).functions.id()
        const txHash=await contract.connect(wallet).functions.mintBatch(user.wallet,cantidad,tipo);
        for (let i=Number(nftId);i<Number(nftId)+cantidad;i++) {
          nftIDs.push(i);
            // / create a NFT in BD
            console.log(i)
        await prisma.nfts.create({
          data: {
            User_id:user.id,
            id:i,
            eventoId:eventoId,
            tipo: tipo==0? "Entrada" : "Cupon",
            txHash:txHash.hash
          },
        });
        await prisma.orders.create({
          data: {
            sellerID:Number(user.id),
            nftId:i,
            eventoId:eventoId,
            price:Number(price),
            active:true,
            createdAt:new Date()
          },
        })
        }
      
      
      res.json(({data:{User_id:user.id,
        wallet:user.wallet,
        ids:nftIDs,
        cantidad:Number(cantidad),
        eventoId:eventoId,
        precio:price,
        tipo:tipo==0? "Entrada" : "Cupon",txHashs:txHash.hash}}));
    } else {
      res.json({ error: "User not valid" });

    }
  } catch ( error ) {
    console.log(error)
    res.json({error });
  }
};
export const cancellSellNft = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
      // @ts-ignore
      const USER = req.user as User;
    const { orderId } = req?.body;
    const user = await getUserById(USER.id,prisma)
    const order= await getOrder(orderId,prisma)

    if ( order?.sellerID===user?.id && order) {
      await prisma.orders.update({ where:{id:orderId},
        data: {
          active:false,
        },
      })
      res.json(({data:"ORDEN DESACTIVADA"}));

    } else  {
      res.json(({data:"Order found!"}));

    }
  } catch (error) {
    console.log(error)
    res.json(({ error }));
  }
};



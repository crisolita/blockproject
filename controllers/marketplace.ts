import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
  getUserById,
} from "../service/user";
import contract, {  wallet } from "../service/web3";
import {  getNftsForOrder, getOrder } from "../service/marketplace";
import { createCharge } from "../service/stripe";
export const sellNFT = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
      // @ts-ignore
      const USER = req.user as User;
    const { nftId,cantidad,price } = req?.body;
    const user = await getUserById(USER.id,prisma)
    const nft = await getNftsForOrder(nftId,USER.id,cantidad,prisma);
    const balance= await contract.functions.balanceOf(user?.wallet,nftId);
    console.log(balance)
    if (nft && balance>=cantidad) {
      await prisma.orders.create({
        data: {
          sellerID:Number(USER.id),
          nftId:Number(nftId),
          cantidad:Number(cantidad),
          price:Number(price),
          active:true
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
    if(order?.active  && buyer) {
      const seller= await getUserById(`${order?.sellerID}`,prisma)
      //VALIDAR EL PAGO
      //  Hacer transferFrom 
      if(seller && seller.acctStpId && buyer.id) {
        const charge=await createCharge(buyer.id.toString(),seller.acctStpId,cardNumber,exp_month,exp_year,cvc,(order.price*100).toString(),prisma)
        if(!charge) return res.json({error:"PAgo con tarjeta ha fallado"})
        const transferFrom= await contract.connect(wallet).functions.safeTransferFrom(seller.wallet,buyer.wallet,order.nftId,order.cantidad, "0x")
        await prisma.orders.update({
          where: { id: Number(order.id) },
          data: {
            active: false,
            txHash:transferFrom.hash,
            buyerId:buyer.id
          },
        })
        return res.json(({data:{orderId:orderId,txHash:transferFrom.hash,buyerId:buyer.id,sellerId:seller.id,price:order.price,cantidad:order.cantidad}}));
      } else return res.json({error: "Vendedor de no valido"})
      
      //Cambiar los nfts en la base de datos
      // const balance= await contract.functions.balanceOf(user?.wallet,nftId);
      //TRASPASAR EL PAGO O LA OPCION QUE SEA
    } else  {
      return res.json(({error:"ORDEN  NO ENCONTRADA"}));
    }

  } catch (error) {
    console.log(error)
    res.json(({ error }));
  }
};
export const createNFT = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
     // @ts-ignore
     const USER = req.user as User;
    const { imageIpfs,nombre,cantidad,royalty } = req?.body;
    const user= await getUserById(USER.id,prisma);
    ///VALIDACION DE QUE ESTE USUARIO HAYA PAGADO
    if(user && user.wallet) {
      ///mint NFT

      const nftId= await contract.connect(wallet).functions.id()
      const txHash=await contract.connect(wallet).functions.mintNew(user.wallet,cantidad,royalty,nombre,imageIpfs);
      // / create a NFT in BD
      await prisma.nfts.create({
        data: {
          User_id:user.id,
          id:Number(nftId),
          nombre:nombre,
          cantidad:Number(cantidad),
          royalty:Number(royalty),
          imageIpfs:imageIpfs,
          txHash:txHash.hash
        },
      });
      res.json(({data:{User_id:user.id,
        wallet:user.wallet,
        id:Number(nftId),
        nombre:nombre,
        cantidad:Number(cantidad),
        royalty:Number(royalty),
        imageIpfs:imageIpfs,txHash:txHash.hash}}));
    } else {
      res.json({ error: "User not valid" });

    }
  } catch ( error ) {
    console.log(error)
    res.json({error });
  }
};


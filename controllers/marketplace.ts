import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { normalizeResponse } from "../utils/utils";
import {
  getUserById,
} from "../service/user";
import contract, { provider, wallet } from "../service/web3";
import { ethers } from "ethers";
import {  getNftsForOrder, getOrder } from "../service/marketplace";
export const sellNFT = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    const { nftId,userId,cantidad,price } = req?.body;
    const user = await getUserById(userId,prisma)
    const nft = await getNftsForOrder(nftId,userId,cantidad,prisma);
    const balance= await contract.functions.balanceOf(user?.wallet,nftId);
    console.log(balance)
    if (nft && balance>=cantidad) {
      await prisma.orders.create({
        data: {
          User_id:Number(userId),
          nftId:Number(nftId),
          cantidad:Number(cantidad),
          price:Number(price)
        },
      })
      res.json(normalizeResponse({data:"ORDEN CREADA"}));

    } else  {
      res.json(normalizeResponse({data:"No NFT found!!"}));

    }
  } catch (error) {
    console.log(error)
    res.json(normalizeResponse({ error }));
  }
};
export const buyNFT = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    const { orderId, buyerId } = req?.body;
    const order = await getOrder(orderId,prisma)
    const seller= await getUserById(orderId,prisma)
    const buyer= await getUserById(buyerId,prisma)
    console.log(order)
    if(order && seller && buyer) {
      //VALIDAR EL PAGO
      //  Hacer transferFrom 
      const transferFrom= await contract.connect(wallet).functions.safeTransferFrom(seller.wallet,buyer.wallet,order.nftId,order.cantidad, "0x")
      await prisma.orders.update({
        where: { id: Number(order.id) },
        data: {
          active: false,
          txHash:transferFrom.hash
        },
      })
      console.log(transferFrom)
      
      //Cambiar los nfts en la base de datos
      // const balance= await contract.functions.balanceOf(user?.wallet,nftId);
      //TRASPASAR EL PAGO O LA OPCION QUE SEA
      res.json(normalizeResponse({data:"ORDEN ENCONTRADA"}));
    } else  {
      res.json(normalizeResponse({data:"ORDEN  NO ENCONTRADA"}));

    }


  } catch (error) {
    console.log(error)
    res.json(normalizeResponse({ error }));
  }
};
export const createNFT = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    const { userId,imageIpfs,nombre,cantidad,royalty } = req?.body;
    const user= await getUserById(userId,prisma);
    ///VALIDACION DE QUE ESTE USUARIO HAYA PAGADO
    if(user && user.wallet) {
      ///mint NFT
      const nftId= await contract.connect(wallet).functions.id()
      await contract.connect(wallet).functions.mintNew(user.wallet,cantidad,royalty,nombre,imageIpfs);
      // / create a NFT in BD
      await prisma.nfts.create({
        data: {
          User_id:user.id,
          id:Number(nftId),
          nombre:nombre,
          cantidad:Number(cantidad),
          royalty:Number(royalty),
          imageIpfs:imageIpfs,
          active: true
        },
      });
      res.json(normalizeResponse({data:{User_id:user.id,
        wallet:user.wallet,
        id:Number(nftId),
        nombre:nombre,
        cantidad:Number(cantidad),
        royalty:Number(royalty),
        imageIpfs:imageIpfs}}));
    } else {
      res.json(normalizeResponse({ data: "User not valid" }));

    }

  } catch ( error ) {
    console.log(error)
    res.json(normalizeResponse({error }));
  }
};


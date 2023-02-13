import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { normalizeResponse } from "../utils/utils";
import {
  getUserById,
} from "../service/user";
import contract, { provider } from "../service/web3";
import { ethers } from "ethers";
import {  getNftsForOrder } from "../service/marketplace";
export const sellNFT = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    const { nftId,userId,cantidad,price } = req?.body;
    const nft = await getNftsForOrder(nftId,userId,cantidad,prisma);
    // const balance= await contract.functions.balanceOf(user)
    if (nft) {
      await prisma.orders.create({
        data: {
          User_id:userId,
          nftId:Number(nftId),
          cantidad:Number(cantidad),
          price:Number(price)
        },
      })
    } else  {
      res.json(normalizeResponse({data:"No NFT found!!"}));

    }
  } catch (error) {
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
      const wallet = new ethers.Wallet(process.env.ADMINPRIVATEKEY as string, provider);
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
          imageIpfs:imageIpfs
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


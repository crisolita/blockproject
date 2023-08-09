import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
  getUserById,
} from "../service/user";
import contract, {  wallet } from "../service/web3";


export const createEvent = async (req: Request, res: Response) => {
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


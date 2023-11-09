import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { getUserById } from "../service/user";
export const updateRolUser= async (req:Request,res: Response) => {
    try {
       // @ts-ignore
       const prisma = req.prisma as PrismaClient;
       const {user_id,user_rol,status}= req.body;
      const user= await getUserById(user_id,prisma)
      if(!user) return res.status(404).json({error:"Usuario no encontrado"})
      if(user_rol=="ORGANIZADOR") {
        const request= await prisma.requestOrganizador.findUnique({where:{user_id}})
        if(!request) return res.status(404).json({error:"Request not found"})
        await prisma.requestOrganizador.update({where:{user_id},data:{status}})
      } 
      if(status=="APROBADO") await prisma.user.update({where:{id:user_id},data:{user_rol}})
    return res.json({user_rol,user_id,status})
    } catch (e) {
      console.log(e)
      res.status(500).json({error:e})
    }
    }
    export const setRoyalty= async (req:Request,res: Response) => {
      try {
         // @ts-ignore
         const prisma = req.prisma as PrismaClient;
         const {royalty}= req.body;
         const config= await prisma.marketplaceConfig.findFirst()
         if(!config) {
           await prisma.marketplaceConfig.create({
            data:{
              royalty
            }
           })
         } else {
          await prisma.marketplaceConfig.update({where:{id:config.id},
            data:{
              royalty
            }
           })
         }
      return res.json(royalty)
      } catch (e) {
        console.log(e)
        res.status(500).json({error:e})
      }
      }
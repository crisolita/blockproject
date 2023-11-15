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
      export const getAllUsers= async (req:Request,res: Response) => {
        try {
           // @ts-ignore
           const prisma = req.prisma as PrismaClient;
           let data=[];
           let eventos;
           let users= await prisma.user.findMany()
           for (let user of users) {
            const nfts= await prisma.nfts.findMany({where:{User_id:user.id}})
          
            if(user.user_rol=="ORGANIZADOR") {
               eventos= await prisma.eventos.findMany({where:{creator_id:user.id}})
            }
            const request= await prisma.requestOrganizador.findUnique({where:{user_id:user.id}})
            data.push({
              email:user.email,id:user.id,googleId:user.id,first_name:user.first_name,last_name:user.last_name,user_rol:user.user_rol,birth_date:user.birth_date,company_name:user.company_name,company_cif:user.company_cif, instagram:user.instagram,facebook:user.facebook,numero_de_licencia:user.numero_de_licencia,descripcion:user.descripcion,twitter:user.twitter,foto_perfil:user.foto_perfil,acctStpId:user.acctStpId,
              nfts,
              eventos,
              requestedOrganizador:request?.status
            })
           }
        return res.json(data)
        } catch (e) {
          console.log(e)
          res.status(500).json({error:e})
        }
        }
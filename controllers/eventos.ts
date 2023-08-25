import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
  getUserById,
} from "../service/user";
import { getEventoById, updateEvento } from "../service/evento";
import moment from "moment";
import { getEntradaByEventoID } from "../service/entrada";



export const createEvent = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
     // @ts-ignore
     const USER = req.user as User;
    const {name, place,date, modalidad, profile_image, banner_image,instagram, twitter,facebook,distancia } = req?.body;
    const user= await getUserById(USER.id,prisma);
    if(!moment(date).isValid()) return res.status(400).json({error:"Fecha no valida"})
    if(user) {
      await prisma.eventos.create({
        data:{
          creator_id:user.id,
          name:name,
          place:place,
          date:date,
          modalidad:modalidad,
          distancia:distancia,
          profile_image:profile_image,
          banner_image:banner_image,
          instagram:instagram,
          twitter:twitter,
          facebook:facebook
        }
      })
      res.json(({data:{creator_id:user.id,
        name:name,
        place:place,
        date:date,
        modalidad:modalidad,
        profile_image:profile_image,
        banner_image:banner_image,
        instagram:instagram,
        twitter:twitter,
        facebook:facebook}}));
    } else {
      res.json({ error: "User not valid" });

    }
  } catch ( error ) {
    console.log(error)
    res.json({error });
  }
};
export const updateEvent = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
     // @ts-ignore
     const USER = req.user as User;
    const {data, eventoId } = req?.body;
    const user= await getUserById(USER.id,prisma);
    if(!user) return res.status(404).json({error:"User no valid"})
    const evento= await getEventoById(eventoId,prisma)
    const entradas= await getEntradaByEventoID(eventoId,prisma)
    if(entradas) return res.status(400).json({error:"Este evento ya ha vendido entradas"})
    if(evento && evento.creator_id==user.id) {
      const updated=await updateEvento(eventoId,data,prisma)
      return res.json(updated)
    } else {
      return res.status(400).json({error:"No event found with creator id"})
    }

  } catch ( error ) {
    console.log(error)
    res.json({error });
  }
};
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
     // @ts-ignore
     const USER = req.user as User;
    const { id } = req?.body;
    const user= await getUserById(USER.id,prisma);
    if(!user) return res.status(4040).json({error:"User no valid"})
    const evento= await getEventoById(id,prisma)
    const entradas= await getEntradaByEventoID(id,prisma)
    if(entradas) return res.status(400).json({error:"Este evento ya ha vendido entradas"})
    if(evento && evento.creator_id==user.id) {
      const updated=await prisma.eventos.delete({where:{id}})
      return res.json({data:"OK"})
    } else {
      return res.status(400).json({error:"No event found with creator id"})
    }

  } catch ( error ) {
    console.log(error)
    res.json({error });
  }
};
export const getAll = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
     // @ts-ignore
     const USER = req.user as User;
    const user= await getUserById(USER.id,prisma);
    if(!user) return res.status(404).json({error:"User no valid"})
    const eventos= await prisma.eventos.findMany()
  
   return res.json({data:eventos})

  } catch ( error ) {
    console.log(error)
    res.json({error });
  }
};
// export const getByParam = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//      // @ts-ignore
//      const USER = req.user as User;
//      const {param, body}=req.params;
//     const user= await getUserById(USER.id,prisma);
//     if(!user) return res.status(404).json({error:"User no valid"})
//     const eventos= await prisma.eventos.findMany({where:{}})
  
//    return res.json({data:eventos})

//   } catch ( error ) {
//     console.log(error)
//     res.json({error });
//   }
// };




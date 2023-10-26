import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
  getUserById,
} from "../service/user";
import { createEvento, getEventoById, updateEvento } from "../service/evento";
import moment from "moment";
import { getEntradaByEventoID } from "../service/entrada";
import { uploadImage } from "../service/aws";


export const createEvent = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const prisma = req.prisma as PrismaClient;
        //@ts-ignore
    const USER = req.user as User;
    const { name, place, date, modalidad, instagram, twitter, facebook, distancia, subcategoria } = req.body;

    const user = await getUserById(USER.id, prisma);

    if (user) {
      let event = await createEvento({
        name,
        creator_id: user.id,
        place,
        date: new Date(date),
        modalidad,
        instagram,
        subcategoria,
        twitter,
        facebook,
        distancia,
      }, prisma);

   

      res.json(event);
    } else {
      res.status(400).json({ error: "User not valid" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const addProfileEvent = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const prisma = req.prisma as PrismaClient;
        //@ts-ignore
    const USER = req.user as User;
    const { event_id,profile_image } = req.body;

  
        const pathProfile = `profile_${event_id}`;
        await handleImageUpload(profile_image, pathProfile);
       let  event = await updateEvento(event_id, { profile_image: pathProfile }, prisma);

      res.json(event);
    }
   catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const addBannerEvent = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const prisma = req.prisma as PrismaClient;
        //@ts-ignore
    const USER = req.user as User;
    const { event_id,banner_image } = req.body;

  
        const pathProfile = `profile_${event_id}`;
        await handleImageUpload(banner_image, pathProfile);
       let  event = await updateEvento(event_id, { banner_image: pathProfile }, prisma);

      res.json(event);
    }
   catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const handleImageUpload = async (base64Image: string, path: string) => {
  const data = Buffer.from(base64Image.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64');
  await uploadImage(data, path);
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
  
   return res.json(eventos)

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




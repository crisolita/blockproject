import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
  getUserById,
} from "../service/user";
import { createEvento, getEventoById, updateEvento } from "../service/evento";
import { getEntradaByEventoID } from "../service/entrada";
import { uploadImage } from "../service/aws";


export const createEvent = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const prisma = req.prisma as PrismaClient;
        //@ts-ignore
    const USER = req.user as User;
    const { name, place, date, modalidad, instagram, twitter, facebook, distancia, subcategoria,fecha_inicio_venta,fecha_fin_venta,fecha_asignacion,descripcion} = req.body;

    const user = await getUserById(USER.id, prisma);
  
    
    if (user) {
      let event = await createEvento({
        name,
        creator_id: user.id,
        place,
        date:new Date(date),
        modalidad,
        instagram,
        subcategoria,
        twitter,
        facebook,
        descripcion,
        fecha_inicio_venta:fecha_inicio_venta? new Date(fecha_inicio_venta):undefined,fecha_fin_venta:fecha_fin_venta? new Date(fecha_fin_venta): undefined,fecha_asignacion:fecha_asignacion? new Date(fecha_asignacion):undefined,
        distancia:Number(distancia),
      }, prisma);
      if(req.files ) {
          //@ts-ignore
    const profile = req.files['profile']? req.files['profile'][0].buffer: undefined;
      if(profile) {
        const base64ImageProfile = profile.toString('base64');
        const pathProfile = `profile_event_${event.id}`;
        await handleImageUpload(base64ImageProfile,pathProfile)
        await updateEvento(event.id,{profile_image:pathProfile},prisma)
      }
              //@ts-ignore
        const banner = req.files['banner']? req.files['banner'][0].buffer: undefined
        if(banner) {
          const bannerPath=`banner_event_${event.id}`
          const base64ImageBanner = banner.toString('base64');
         await handleImageUpload(base64ImageBanner,bannerPath)
         await updateEvento(event.id,{banner_image:bannerPath},prisma)
        }
     
      }
      res.json(event);
    } else {
      res.status(400).json({ error: "User not valid" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const handleImageUpload = async (base64Image: string, path: string) => {
  const data = Buffer.from(base64Image, 'base64');
  console.log("VOy a su")
  await uploadImage(data, path);
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const prisma = req.prisma as PrismaClient;
        //@ts-ignore
    const USER = req.user as User;
    const { event_id,name, place, date, modalidad, descripcion,instagram, twitter, facebook, distancia, subcategoria,fecha_inicio_venta,fecha_fin_venta,fecha_asignacion } = req.body;

    const user = await getUserById(USER.id, prisma);
    const event = await getEventoById(event_id,prisma)
    if(!event) return res.status(404).json({error:"Evento no encontrado"})
    if (user) {
      let updated = await updateEvento(event.id,{
        name,
        creator_id: user.id,
        place,
        date:date? new Date(date): event.date,
        modalidad,
        instagram,
        subcategoria,
        twitter,
        facebook,
        descripcion,
        fecha_inicio_venta:fecha_inicio_venta? new Date(fecha_inicio_venta):event.fecha_inicio_venta,fecha_fin_venta:fecha_fin_venta? new Date(fecha_fin_venta): undefined,fecha_asignacion:fecha_asignacion? new Date(fecha_asignacion):event.fecha_asignacion,
        distancia:Number(distancia),
      }, prisma);
      if(req.files) {
          //@ts-ignore
    const profile = req.files['profile']? req.files['profile'][0].buffer: undefined;
      if(profile) {
        const base64ImageProfile = profile.toString('base64');
        const pathProfile = `profile_event_${event.id}`;
        await handleImageUpload(base64ImageProfile,pathProfile)
        await updateEvento(event.id,{
          profile_image: pathProfile
        },prisma)
      }
              //@ts-ignore
        const banner = req.files['banner']? req.files['banner'][0].buffer: undefined
        if(banner) {
          const bannerPath=`banner_event_${event.id}`
          const base64ImageBanner = banner.toString('base64');
         await handleImageUpload(base64ImageBanner,bannerPath)
         await updateEvento(event.id,{banner_image:bannerPath},prisma)
        }
     
      }
      res.json(event);
    } else {
      res.status(400).json({ error: "User not valid" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




/// arreglar
// export const deleteEvent = async (req: Request, res: Response) => {
//   try {
//     // @ts-ignore
//     const prisma = req.prisma as PrismaClient;
//      // @ts-ignore
//      const USER = req.user as User;
//     const { id } = req?.body;
//     const user= await getUserById(USER.id,prisma);
//     if(!user) return res.status(4040).json({error:"User no valid"})
//     const evento= await getEventoById(id,prisma)
//     const entradas= await getEntradaByEventoID(id,prisma)
//     if(entradas) return res.status(400).json({error:"Este evento ya ha vendido entradas"})
//     if(evento && evento.creator_id==user.id) {
//       const updated=await prisma.eventos.delete({where:{id}})
//       return res.json({data:"OK"})
//     } else {
//       return res.status(400).json({error:"No event found with creator id"})
//     }

//   } catch ( error ) {
//     console.log(error)
//     res.json({error });
//   }
// };
export const getAll = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
  
    const eventos= await prisma.eventos.findMany()

   return res.json(eventos)

  } catch ( error ) {
    console.log(error)
    res.json({error });
  }
};
export const getEvent = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    const {event_id} = req.body;
    const evento= await getEventoById(event_id,prisma)

   return res.json(evento)

  } catch ( error ) {
    console.log(error)
    res.json({error });
  }
};



export const getNFTS = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
     // @ts-ignore
     const USER = req.user as User;
     const {event_id}= req.query;
    const user=await getUserById(USER.id,prisma);
    if(!user) return res.status(404).json({error:"User no valido"})
    const evento= await getEventoById(Number(event_id),prisma)
  if(evento?.creator_id!==USER.id) return res.status(404).json({error:"Evento no pertenece al usuario"}) 
    let nfts= await prisma.nfts.findMany({where:{eventoId:Number(event_id)}})
    let data=[];
    for (let nft of nfts ) {
        if (nft.User_id==USER.id) continue
        data.push(nft)
    }
    return res.json(data)
  } catch (error) {
    console.log(error)
    res.json({ error:error});
  }
};

export const asignarDorsal = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
     // @ts-ignore
     const USER = req.user as User;
     const {dorsal_number,nft_id}=req.body;
    const user=await getUserById(USER.id,prisma);
    if(!user) return res.status(404).json({error:"User no valido"})
    let nft= await prisma.nfts.findUnique({where:{id:nft_id}})
  if(!nft ) return res.status(404).json({error:"NFT inexistente"})
    nft= await prisma.nfts.update({where:{id:nft_id},data:{dorsal:dorsal_number}})
  return res.json(nft)
  } catch (error) {
    console.log(error)
    res.json({ error:error});
  }
};
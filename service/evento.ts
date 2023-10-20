import { Modales, PrismaClient, SubCategorias } from "@prisma/client";

export const getEventoById = async (id: number, prisma: PrismaClient) => {
  return await prisma.eventos.findUnique({
    where: { id: Number(id) },
  });
};


export const updateEvento= async (
  id: number,
  data: { distancia?:number,name?:string, place?:string,date?:string, modalidad?:Modales, profile_image?:string, banner_image?:string,instagram?:string, twitter?:string,facebook?:string},
  prisma: PrismaClient
) => {
  return await prisma.eventos.update({
    where: { id:id },
    data: {
      ...data,
    },
  });
};
export const createEvento= async (
  data: {name:string,creator_id: number,subcategoria?:SubCategorias, place?:string,date:Date, modalidad:Modales, profile_image?:string, banner_image?:string,instagram?:string, twitter?:string,facebook?:string,distancia?:number},
  prisma: PrismaClient
) => {
  return await prisma.eventos.create({
   data:{...data}
  });
};

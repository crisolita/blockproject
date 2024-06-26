import { Modales, PrismaClient, SubCategorias } from "@prisma/client";

export const getEventoById = async (id: number, prisma: PrismaClient) => {
  return await prisma.eventos.findUnique({
    where: { id: Number(id) },
  });
};


export const updateEvento= async (
  id: number,
  data: {name?:string ,creator_id?: number, fecha_inicio_venta?:Date| null,fecha_final_venta?:Date| null,fecha_asignacion?:Date| null,subcategoria?:SubCategorias, place?:string,date?:Date, modalidad?:Modales, profile_image?:string, banner_image?:string,instagram?:string, twitter?:string,facebook?:string,distancia?:number,dorsales?:string[],descripcion?:string},
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
  data: {name:string,creator_id: number, fecha_inicio_venta?:Date,fecha_final_venta?:Date,fecha_asignacion?:Date,subcategoria?:SubCategorias, place?:string,date:Date, modalidad:Modales, profile_image?:string, banner_image?:string,instagram?:string, twitter?:string,facebook?:string,distancia?:number,descripcion?:string},
  prisma: PrismaClient
) => {
  return await prisma.eventos.create({
   data:{...data}
  });
};

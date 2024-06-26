import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { getUserById } from "../service/user";
import { createEvento, getEventoById, updateEvento } from "../service/evento";
import { getEntradaByNFTID } from "../service/entrada";
import { getImage, uploadImage } from "../service/aws";
import { sendCambiosEventos } from "../service/mail";
import axios from "axios";
export const createEvent = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const prisma = req.prisma as PrismaClient;
    //@ts-ignore
    const USER = req.user as User;
    const {
      name,
      place,
      date,
      modalidad,
      instagram,
      twitter,
      facebook,
      distancia,
      subcategoria,
      fecha_inicio_venta,
      fecha_final_venta,
      fecha_asignacion,
      descripcion,
    } = req.body;

    const user = await getUserById(USER.id, prisma);

    if (user) {
      let event = await createEvento(
        {
          name,
          creator_id: user.id,
          place,
          date: new Date(date),
          modalidad,
          instagram,
          subcategoria,
          twitter,
          facebook,
          descripcion,
          fecha_inicio_venta: fecha_inicio_venta
            ? new Date(fecha_inicio_venta)
            : undefined,
          fecha_final_venta: fecha_final_venta
            ? new Date(fecha_final_venta)
            : undefined,
          fecha_asignacion: fecha_asignacion
            ? new Date(fecha_asignacion)
            : undefined,
          distancia: Number(distancia),
        },
        prisma
      );
      if (req.files) {
        if ("profile" in req.files) {
          const profile = req.files["profile"][0].buffer;

          const base64ImageProfile = profile.toString("base64");
          const pathProfile = `profile_event_${event.id}`;
          await handleImageUpload(base64ImageProfile, pathProfile);
          await updateEvento(event.id, { profile_image: pathProfile }, prisma);
        }

        if ("banner" in req.files) {
          //@ts-ignore
          const banner = req.files["banner"][0].buffer;
          if (banner) {
            const bannerPath = `banner_event_${event.id}`;
            const base64ImageBanner = banner.toString("base64");
            await handleImageUpload(base64ImageBanner, bannerPath);
            await updateEvento(event.id, { banner_image: bannerPath }, prisma);
          }
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
  const data = Buffer.from(base64Image, "base64");
  console.log("VOy a su");
  await uploadImage(data, path);
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const prisma = req.prisma as PrismaClient;
    //@ts-ignore
    const USER = req.user as User;
    const {
      event_id,
      name,
      place,
      date,
      modalidad,
      descripcion,
      instagram,
      twitter,
      facebook,
      distancia,
      subcategoria,
      fecha_inicio_venta,
      fecha_final_venta,
      fecha_asignacion,
    } = req.body;

    const user = await getUserById(USER.id, prisma);
    const event = await getEventoById(event_id, prisma);
    if (!event) return res.status(404).json({ error: "Evento no encontrado" });
    if (user) {
      let updated = await updateEvento(
        event.id,
        {
          name,
          creator_id: user.id,
          place,
          date: date ? new Date(date) : event.date,
          modalidad,
          instagram,
          subcategoria,
          twitter,
          facebook,
          descripcion,
          fecha_inicio_venta: fecha_inicio_venta
            ? new Date(fecha_inicio_venta)
            : event.fecha_inicio_venta,
          fecha_final_venta: fecha_final_venta
            ? new Date(fecha_final_venta)
            : undefined,
          fecha_asignacion: fecha_asignacion
            ? new Date(fecha_asignacion)
            : event.fecha_asignacion,
          distancia: Number(distancia),
        },
        prisma
      );
      if (req.files) {
        if ("profile" in req.files) {
          const profile = req.files["profile"][0].buffer;

          if (profile) {
            const base64ImageProfile = profile.toString("base64");
            const pathProfile = `profile_event_${event.id}`;
            await handleImageUpload(base64ImageProfile, pathProfile);
            await updateEvento(
              event.id,
              {
                profile_image: pathProfile,
              },
              prisma
            );
          }
        }
        if ("banner" in req.files) {
          const banner = req.files["banner"][0].buffer;
          if (banner) {
            const bannerPath = `banner_event_${event.id}`;
            const base64ImageBanner = banner.toString("base64");
            await handleImageUpload(base64ImageBanner, bannerPath);
            await updateEvento(event.id, { banner_image: bannerPath }, prisma);
          }
        }
      }
      let orders = await prisma.orders.findMany({
        where: { eventoId: event.id, status: "vendido" },
      });
      let buyers: number[] = [];
      orders.forEach((x) => {
        if (x.buyerId && !buyers.includes(x.buyerId)) {
          buyers.push(x.buyerId);
        }
      });
      for (let buy of buyers) {
        const user = await getUserById(buy, prisma);
        if (user) await sendCambiosEventos(user.email, event.name);
      }

      res.json(updated);
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
//     res.status(500).json(error );
//   }
// };
export const getAll = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;

    const eventos = await prisma.eventos.findMany();

    return res.json(eventos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
export const getEvent = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    const { event_id } = req.body;
    const evento = await getEventoById(Number(event_id), prisma);
    let ordersReSell = await prisma.orders.findMany({
      where: { eventoId: event_id, status: "venta_activa", resell: true },
    });
    ordersReSell = ordersReSell.filter((x) => {
      return x.sellerID != evento?.creator_id;
    });
    return res.json({ evento, ordersReSell });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const getNFTS = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    // @ts-ignore
    const USER = req.user as User;
    const { event_id } = req.body;
    const user = await getUserById(USER.id, prisma);
    if (!user) return res.status(404).json({ error: "User no valido" });
    let data = await prisma.nfts.findMany({
      where: { eventoId: Number(event_id) },
    });
    let nfts = [];
    for (let dat of data) {
      let event = await getEventoById(event_id, prisma);
      let image;
      if (event?.profile_image) {
        image = await getImage(event?.profile_image);
      }
      nfts.push({
        dat,
        image,
        name: `${user.first_name} ${user.last_name}`,
      });
    }

    return res.json(nfts);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
export const getNFTSByUser = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    // @ts-ignore
    const USER = req.user as User;
    const user = await getUserById(USER.id, prisma);
    if (!user) return res.status(404).json({ error: "User no valido" });
    let nfts = await prisma.nfts.findMany({ where: { User_id: user.id } });

    return res.json(nfts);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const asignarDorsal = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    // @ts-ignore
    const USER = req.user as User;
    const { dorsales } = req.body;
    const user = await getUserById(USER.id, prisma);
    if (!user) return res.status(404).json({ error: "User no valido" });
    let nfts = [];
    /// VALIDAR QUE DORSAL SEA UNICO EN EL EVENTO
    for (let dorsal of dorsales) {
      let nft = await prisma.nfts.findUnique({ where: { id: dorsal.nftId } });
      if (!nft) continue;
      let event = await getEventoById(nft.eventoId, prisma);
      if (event?.creator_id != user.id) continue;
      const exist = await prisma.nfts.findFirst({
        where: { eventoId: nft.eventoId, dorsal: dorsal.dorsal },
      });
      if (exist) continue;
      nft = await prisma.nfts.update({
        where: { id: dorsal.nftId },
        data: { dorsal: dorsal.dorsal },
      });
      event = await updateEvento(
        event.id,
        { dorsales: event.dorsales.concat(dorsal.dorsal) },
        prisma
      );
      nfts.push(nft);
    }
    return res.json(nfts);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
export const getNFTSByEventsVendidos = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    // @ts-ignore
    const USER = req.user as User;
    const { event_id } = req.body;
    const user = await getUserById(USER.id, prisma);
    if (!user) return res.status(404).json({ error: "User no valido" });
    const evento = await getEventoById(Number(event_id), prisma);

    if (evento?.creator_id !== USER.id)
      return res.status(404).json({ error: "Evento no pertenece al usuario" });
    let eventImage;
    if (evento?.profile_image) {
      eventImage = await getImage(evento?.profile_image);
    }

    let allnfts = await prisma.nfts.findMany({
      where: { eventoId: Number(event_id) },
    });
    let nfts = [];
    for (let nft of allnfts) {
      if (nft.User_id == USER.id) continue;
      const username = await getUserById(nft.User_id, prisma);
      nfts.push({
        nft,
        image: eventImage,
        name: evento?.name,
        username: `${username?.first_name} ${username?.last_name}`,
      });
    }
    return res.json(nfts);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
export const getInscripcionesByEvent = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    // @ts-ignore
    const USER = req.user as User;
    const { event_id } = req.body;
    const user = await getUserById(USER.id, prisma);
    if (!user) return res.status(404).json({ error: "User no valido" });
    const evento = await getEventoById(Number(event_id), prisma);
    let order = await prisma.orders.findFirst({
      where: {
        eventoId: Number(event_id),
        status: "venta_activa",
        sellerID: evento?.creator_id,
      },
    });
    let data = [];
    let adicionales = [];
    let preguntas = [];
    if (order) {
      if (order?.adicionalesIds) {
        for (let adicional of order.adicionalesIds) {
          const data = await prisma.adicionales.findUnique({
            where: { id: adicional },
          });
          if (data) adicionales.push(data);
        }
      }
      if (order?.preguntasIds) {
        for (let pregunta of order.preguntasIds) {
          const data = await prisma.preguntas.findUnique({
            where: { id: pregunta },
          });
          if (data) preguntas.push(data);
        }
      }

      data = [
        {
          orderId: order.id,
          nftId: order.nftId,
          eventoId: order.eventoId,
          precio_batch: JSON.parse(order.precio_batch),
          status: order.status,
          createdAt: order.createdAt,
          adicionales: adicionales,
          preguntas: preguntas,
          license_required: order.license_required,
        },
      ];

      return res.json(data);
    } else
      return res.json({ data: "No hay ordenes a la venta para este evento" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
export const getAllInscripcionesCompradas = async (
  req: Request,
  res: Response
) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    // @ts-ignore
    const USER = req.user as User;
    const user = await getUserById(USER.id, prisma);
    if (!user) return res.status(404).json({ error: "User no valido" });
    let nfts = await prisma.nfts.findMany({ where: { User_id: user.id } });
    let data = [];
    nfts = nfts.filter((x) => {
      return x.compradoAt != null;
    });
    for (let nft of nfts) {
      const evento = await getEventoById(nft.eventoId, prisma);
      const entrada = await getEntradaByNFTID(nft.id, prisma);
      if (entrada) continue;
      let image;
      if (evento?.profile_image) {
        image = await getImage(evento?.profile_image);
      }
      data.push({
        nft,
        name: evento?.name,
        image: image,
      });
    }
    return res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
export const getAllInscripcionesVendidas = async (
  req: Request,
  res: Response
) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    // @ts-ignore
    const USER = req.user as User;
    const user = await getUserById(USER.id, prisma);
    if (!user) return res.status(404).json({ error: "User no valido" });
    const eventos = await prisma.eventos.findMany();
    let nfts = [];
    for (let evento of eventos) {
      if (evento?.creator_id !== USER.id) continue;
      let allnfts = await prisma.nfts.findMany({
        where: { eventoId: Number(evento.id) },
      });
      for (let nft of allnfts) {
        if (nft.User_id == USER.id) continue;
        let image = evento.profile_image
          ? await getImage(evento.profile_image)
          : null;
        nfts.push({
          nft,
          evento_name: evento.name,
          evento_place: evento.place,
          image,
        });
      }
    }
    return res.json(nfts);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
export const test = async (req: Request, res: Response) => {
  try {
    const list1 = await axios.get(
      "https://www.runnink.com/api/type/index.php/events/list/?token=VkdUqVddWWRmlhvT4wsv636AdvXrHp9IeZ26MmPz30c"
    );
    console.log(list1.data);

    res.json(list1);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

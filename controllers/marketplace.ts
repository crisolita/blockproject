import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
  getUserById,
} from "../service/user";
import contract, {  wallet } from "../service/web3";
import {  createOrder, getIfOrderIsActive, getNftsById, getNftsForOrder, getOrder } from "../service/marketplace";
import { createCharge } from "../service/stripe";
import { getEventoById } from "../service/evento";
import moment from "moment";
export const sellNFT = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
      // @ts-ignore
      const USER = req.user as User;
    const { nftId,priceBatch } = req?.body;
    const user = await getUserById(USER.id,prisma)
    const nft = await getNftsForOrder(nftId,USER.id,prisma);
    let order= await getIfOrderIsActive(nftId,prisma)
    const owner= await contract.functions.ownerOf(nftId)
    if (order) return res.status(400).json({error: `NFT ya esta a la venta`})
    const now= moment()
    if (nft && owner[0]===user?.wallet && user?.acctStpId ) {
      const event= await getEventoById(nft.eventoId,prisma)
      if(!event) return res.status(404).json({error:"Evento no encontrado"})
      if(now.isBetween(moment(event?.fecha_inicio_venta),moment(event?.fecha_final_venta))) return res.status(400).json({error:"Ha finalizado la venta"})
      if(now.isAfter(nft.caducidadVenta) || !nft.marketplace) return res.status(400).json({error:"NFT ha caducado para la venta"})
      let newOrder =await prisma.orders.create({
        data: {
          sellerID:Number(USER.id),
          nftId:nft.id,
          precio_batch:JSON.stringify(priceBatch),
          active:true,
          eventoId:event?.id,
          createdAt: new Date()
        },
      })
      res.json(newOrder);

    } else  {
      res.json(({data:"No NFT found or User not valid"}));

    }
  } catch (error) {
    console.log(error)
    res.json(({ error }));
  }
};


export const buyNFT = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
     // @ts-ignore
     const USER = req.user as User;
    const { orderId,cardNumber,exp_month,exp_year,cvc,adicionales,codigo_descuento,distancia_comprada
    } = req?.body;
    let order = await getOrder(orderId,prisma)
    const buyer= await getUserById(USER.id,prisma)
    const userInfo= await prisma.userInfo.findUnique({where:{user_id:buyer?.id}})
    if(!userInfo) return res.status(404).json({error:"Usuario no puede comprar por falta de informacion"})
    if(!order) return res.status(404).json({error:"Orden no encontrada"})
    if(order.buyerId || order.completedAt || !order.active ) return res.json({error:"Order esta completa"})
    const event= await getEventoById(order.eventoId,prisma)
    const now= moment()
    if(!now.isBetween(moment(event?.fecha_inicio_venta),moment(event?.fecha_final_venta))) return res.status(400).json({error:"Ha finalizado o no ha empezado la venta"})
    const nft= await getNftsById(order.nftId,prisma)
    if(now.isAfter(moment(nft?.caducidadVenta))) return res.status(400).json({error:"Venta ha terminado"})
    const seller= await getUserById(order?.sellerID,prisma)
    let priceActual;
    if(!order.precio_batch)  return res.status(404).json({error:"No hay precios asignados"})
    let precios= JSON.parse(order.precio_batch)
    precios= precios.sort((a: { fecha_tope: string | number | Date; }, b: { fecha_tope: string | number | Date; }) => {
      const fechaA = new Date(a.fecha_tope);
      const fechaB = new Date(b.fecha_tope);
      return Number(fechaA) - Number(fechaB);
    });
    for (let price of precios ) {
      if(now.isAfter(moment(new Date(price.fecha_tope)))) {
        priceActual=price.precio
      }
    }
    if(adicionales && order.adicionalesIds) {
      // let adicByUser=new Set(adicionales)
      let adicByOrder=new Set(order.adicionalesIds)
    const interseccion= adicionales.filter((x: number)=>adicByOrder.has(x))
     for (let inter of interseccion) {
     const adicional= await prisma.adicionales.findUnique({where:{id:inter}})
     priceActual+=adicional?.valor
    }
  }

    if(order.license_required && !userInfo.numero_de_licencia) {
      priceActual+=order.license_required
    }
    if(codigo_descuento && order.codigo_descuento) {
      //validar que el codigo exista para la orden
      const cupon= await prisma.codigos_descuentos.findUnique({where:{cod:codigo_descuento}})
      if(order.codigo_descuento.includes(codigo_descuento) && cupon && cupon.veces_restantes>0) {
        priceActual=priceActual-priceActual*cupon.porcentaje/100  
        await prisma.codigos_descuentos.update({where:{cod:codigo_descuento},data:{veces_restantes:cupon.veces_restantes-1}})
      }
    }

    console.log(priceActual)
    if(buyer && buyer.wallet && seller?.acctStpId && priceActual) {
      //VALIDAR EL PAGO
        const charge=await createCharge(buyer.id,seller.acctStpId,cardNumber,exp_month,exp_year,cvc,(priceActual*100).toString(),prisma)
        if(!charge) return res.json({error:"Pago con tarjeta ha fallado"})
        const transferFrom= await contract.connect(wallet).functions.transferFrom(seller.wallet,buyer.wallet,order.nftId)
        order=await prisma.orders.update({
          where: { id: Number(order.id) },
          data: {
            active: false,
            txHash:transferFrom.hash,
            buyerId:buyer.id,
            completedAt:new Date(),
            adicionalesUsados:JSON.stringify(adicionales),
            precio_usado:Number(priceActual)
          },
        })
        await prisma.nfts.update({
          where:{id:order.nftId}, data:{
            User_id:buyer.id,
            txHash:transferFrom.hash,
            compradoAt: new Date(),
            precio_usado:Number(priceActual),
            distancia_comprada
          }
        })
        return res.json(order);      
    } else  {
      return res.json(({error:"Datos de comprador o vendedor faltantes"}));
    }

  } catch (error) {
    console.log(error)
    res.json({ error:error});
  }
};
export const createAndSellNFT = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
     // @ts-ignore
     const USER = req.user as User;
    const { cantidad,eventoId,tipo,priceBatch,caducidadVenta,marketplaceSell ,adicionales,codigo_descuento,license_required} = req?.body;
    const user= await getUserById(USER.id,prisma);
    const event= await getEventoById(eventoId,prisma)
    if(!event) return res.status(404).json({error:"No event found"})
    if(event.creator_id!==user?.id) return res.status(400).json({error:"user no ha creado el evento"})
    let orders=[]
    let nfts=[]
    for (let precio of priceBatch) {
      if(!moment(precio.fecha_tope).isValid()) return res.status(400).json({error:"Fecha invalida en precio batch"})
    }
    if(user && user.wallet && user.acctStpId) {
      ///mint NFT
      let nftIDs:number[]=[];
        const nftId= await contract.connect(wallet).functions.id()
        const txHash=await contract.connect(wallet).functions.mintBatch(user.wallet,cantidad,tipo=="Entrada"?0:1);
        let adicionalesIds=[]
        let codigos=[]
        if(adicionales) {
          for (let adicional of adicionales) {
            const crear= await prisma.adicionales.create({
              data:{
                concepto:adicional.concepto,
                valor:adicional.valor
              }
            })
            adicionalesIds.push(crear.id)
          }
        }
        if(codigo_descuento) {
          for (let codigo of codigo_descuento) {
            const exist = await prisma.codigos_descuentos.findUnique({where:{cod:codigo.codigo}})
           if(exist) continue
            const crear= await prisma.codigos_descuentos.create({
              data:{
                cod:codigo.codigo,
                porcentaje:codigo.porcentaje,
                veces_restantes:codigo.veces_restantes
              }
            })
            codigos.push(crear.cod)
          }
        }
        for (let i=Number(nftId);i<Number(nftId)+cantidad;i++) {
          nftIDs.push(i);
            // / create a NFT in BD
            console.log(i)
        const nft=await prisma.nfts.create({
          data: {
            User_id:user.id,
            id:i,
            caducidadVenta:new Date(caducidadVenta),
            caducidadCanjeo:eventoId.date,
            marketplace:marketplaceSell,
            eventoId:eventoId,
            tipo:"Entrada",
            txHash:txHash.hash
          },
        });
        nfts.push(nft)
       
   
        const order=await createOrder({sellerID:Number(user.id),
          nftId:i,
          eventoId:eventoId,
          precio_batch:JSON.stringify(priceBatch),
          active:true,
          createdAt:new Date(),
          adicionalesIds:adicionalesIds,
          license_required,
          codigo_descuento:codigos
          },prisma)
        orders.push({
          id:order.id,
          nftId:i,
          eventoId:eventoId,
          precio_batch:JSON.stringify(priceBatch),
          active:true,
          createdAt:new Date(),
          adicionales:adicionales,
          license_required
        })
        }
      
      
      res.json({orders,nfts});
    } else {
      res.status(404).json({ error: "User not valid" });

    }
  } catch ( error ) {
    console.log(error)
    res.status(500).json({error });
  }
};
export const cancellSellNft = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
      // @ts-ignore
      const USER = req.user as User;
    const { orderId } = req?.body;
    const user = await getUserById(USER.id,prisma)
    const order= await getOrder(orderId,prisma)

    if ( order?.sellerID===user?.id && order) {
      await prisma.orders.update({ where:{id:orderId},
        data: {
          active:false,
        },
      })
      res.json(({data:"ORDEN DESACTIVADA"}));

    } else  {
      res.json(({data:"Order found!"}));

    }
  } catch (error) {
    console.log(error)
    res.json(({ error }));
  }
};

export const validarCodigo = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
     // @ts-ignore
     const USER = req.user as User;
    const {codigo,orderId} = req?.body;
    let order = await getOrder(orderId,prisma)
    if(!order?.codigo_descuento.includes(codigo)) return res.status(404).json({error:"Codigo no existe para esta orden"})
    let cod= await prisma.codigos_descuentos.findUnique({where:{cod:codigo}})
    if(!cod) return res.status(400).json({error:"Codigo no existe"})
    return res.json({cod})
  } catch (error) {
    console.log(error)
    res.json({ error:error});
  }
};


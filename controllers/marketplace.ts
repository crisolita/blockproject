import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
  getUserById,
} from "../service/user";
import contract, {  wallet } from "../service/web3";
import {  createOrder, getIfOrderIsActive, getNftsById, getNftsForOrder, getOrder } from "../service/marketplace";
import { createCharge, createCheckoutSession, validateCheckout } from "../service/stripe";
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
          status:'venta_activa',
          eventoId:event?.id,
          createdAt: new Date()
        },
      })
      res.json(newOrder);

    } else  {
      res.status(404).json({error:"No NFT found or User not valid"});

    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
};

export const buyNFTfirstStep = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
     // @ts-ignore
     const USER = req.user as User;
    const { orderId,adicionales,codigo_descuento,respuestas } = req?.body;
    let order = await getOrder(orderId,prisma)
    const buyer= await getUserById(USER.id,prisma)
    const userInfo= await prisma.userInfo.findUnique({where:{user_id:buyer?.id}})
    if(!userInfo) return res.status(404).json({error:"Usuario no puede comprar por falta de informacion"})
    if(!order) return res.status(404).json({error:"Orden no encontrada"})
    if(order.buyerId || order.completedAt || order.status!=="venta_activa" ) return res.status(400).json({error:"Order esta completa"})
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
    console.log(precios)
    console.log(priceActual,"primero")
    
    if(adicionales && order.adicionalesIds) {
      // let adicByUser=new Set(adicionales)
      let adicByOrder=new Set(order.adicionalesIds)
    const interseccion= adicionales.filter((x: number)=>adicByOrder.has(x))
    
    for (let inter of interseccion) {
     const adicional= await prisma.adicionales.findUnique({where:{id:inter}})
     priceActual+=adicional?.valor
    }
  }

  let actualResponse=[]
  if(respuestas && order.preguntasIds) {
    // let adicByUser=new Set(adicionales)
    for (let id of order.preguntasIds) {
    let pregunta= await prisma.preguntas.findUnique({where:{id}})
    const exist= respuestas.find((x:any)=>x.pregunta===pregunta?.pregunta)
    console.log(exist,pregunta)
    if (exist) {
      if (pregunta?.respuestas.includes(exist.respuesta) ) 
      actualResponse.push(exist)
  }
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
    console.log(priceActual,"segundo")

    console.log(priceActual)
   
    if(buyer && buyer.wallet && seller?.acctStpId && priceActual) {
    const session= await createCheckoutSession(seller.acctStpId,(priceActual*100).toString())
    await prisma.orders.update({where:{id:order.id},data:{checkout_id:session.id,status:"pago_pendiente",buyerId:USER.id}})
    return res.json(session.url)
    } else  {
      return res.status(400).json(({error:"Datos de comprador o vendedor faltantes"}));
    }

  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
};
export const createAndSellNFT = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
     // @ts-ignore
     const USER = req.user as User;
    const { cantidad,eventoId,tipo,priceBatch,caducidadVenta,marketplaceSell ,adicionales,codigo_descuento,license_required,preguntas} = req?.body;
    const user= await getUserById(USER.id,prisma);
    const event= await getEventoById(eventoId,prisma)
    if(!event) return res.status(404).json({error:"No event found"})
    if(event.creator_id!==user?.id) return res.status(400).json({error:"user no ha creado el evento"})
    let orders=[]
    let nfts=[]
    for (let precio of priceBatch) {
      if(!moment(precio.fecha_tope).isValid()) return res.status(400).json({error:"Fecha invalida en precio batch"})
      if(moment(precio.fecha_tope).isAfter(moment(event.fecha_inicio_venta))) return res.status(400).json({error:"Fecha invalida en precio batch"})

    }
    if(user && user.wallet && user.acctStpId) {
      ///mint NFT
      let nftIDs:number[]=[];
        const nftId= await contract.connect(wallet).functions.id()
        const txHash=await contract.connect(wallet).functions.mintBatch(user.wallet,cantidad,tipo=="Entrada"?0:1);
        let adicionalesIds=[]
        let codigosUsados=[]
        let codigosYaExiste=[]
        let preguntasIds=[]
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
        if(preguntas) {
          for (let pregunta of preguntas) {
            const crear= await prisma.preguntas.create({
              data:{
                pregunta:pregunta.pregunta,
                respuestas:pregunta.respuestas
              }
            })
            preguntasIds.push(crear.id)
          }
        }
        if(codigo_descuento) {
          for (let codigo of codigo_descuento) {
            const exist = await prisma.codigos_descuentos.findUnique({where:{cod:codigo.codigo}})
           if(exist) { 
            codigosYaExiste.push(exist) 
            continue
           }
            const crear= await prisma.codigos_descuentos.create({
              data:{
                cod:codigo.codigo,
                porcentaje:codigo.porcentaje,
                veces_restantes:codigo.veces_restantes
              }
            })
            codigosUsados.push(crear.cod)
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
          status:'venta_activa',
          createdAt:new Date(),
          adicionalesIds:adicionalesIds,
          preguntasIds,
          license_required,
          codigo_descuento:codigosUsados
          },prisma)
        orders.push({
          id:order.id,
          nftId:i,
          eventoId:eventoId,
          precio_batch:JSON.stringify(priceBatch),
          status:order.status,
          createdAt:new Date(),
          adicionales:adicionales,
          preguntas:preguntas,
          license_required,
          codigosYaExiste
        })
        }
      
      
      res.json(orders[0]);
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
          status:'vendido',
        },
      })
      res.json({data:"ORDEN DESACTIVADA"});

    } else  {
      res.status(404).json({error:"Order found!"});

    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
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
    res.status(500).json({ error:error});
  }
};

export const confirmBuy = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
     // @ts-ignore
     const USER = req.user as User;
    const { orderId } = req?.body;
    let order = await getOrder(orderId,prisma)
    const buyer= await getUserById(USER.id,prisma)
    const userInfo= await prisma.userInfo.findUnique({where:{user_id:buyer?.id}})
    if(!userInfo) return res.status(404).json({error:"Usuario no puede comprar por falta de informacion"})
    if(!order) return res.status(404).json({error:"Orden no encontrada"})
    console.log(order.completedAt,"cc", order.status!="pago_pendiente","", buyer?.id!=order.buyerId)
    if( order.completedAt || order.status!="pago_pendiente" || buyer?.id!=order.buyerId ) return res.status(400).json({error:"Order esta completa"})
    const seller= await getUserById(order?.sellerID,prisma)

    /// Validar pago de stripe
//retrieve the payment
if(order.checkout_id) {
  const paid= await validateCheckout(order.checkout_id)
  console.log(paid)
  if(paid.payment_status=="paid") {
     const transferFrom= await contract.connect(wallet).functions.transferFrom(seller?.wallet,buyer?.wallet,order.nftId)
        order=await prisma.orders.update({
          where: { id: Number(order.id) },
          data: {
            status: 'vendido',
            txHash:transferFrom.hash,
            buyerId:buyer?.id,
            completedAt:new Date()
          },
        })
        await prisma.nfts.update({
          where:{id:order.nftId}, data:{
            User_id:buyer?.id,
            txHash:transferFrom.hash,
            compradoAt: new Date()
          }
        })
        return res.json(order)
  }
} else return res.status(404).json({error:"No hay pago abierto"})
  } catch (error) {
    console.log(error)
    res.json({ error:error});
  }
};
export const cancelBuy = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
     // @ts-ignore
     const USER = req.user as User;
    const { orderId } = req?.body;
    let order = await getOrder(orderId,prisma)
    const buyer= await getUserById(USER.id,prisma)
    if(buyer?.id!=order?.buyerId)  return res.status(400).json({error:"User no es el comprador"})
    if(!order) return res.status(404).json({error:"Orden no encontrada"})
    if( order.completedAt || order.status!="pago_pendiente" ) return res.status(400).json({error:"Order esta completa"})
  order= await prisma.orders.update({
    where: { id: Number(order.id) },
    data: {
      status: 'venta_activa',
      buyerId:null,
      completedAt:null,
      checkout_id:null
    },
  })
  res.json(order)

  } catch (error) {
    console.log(error)
    res.json({ error:error});
  }
};

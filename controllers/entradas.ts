import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
  getUserById,
} from "../service/user";
import { getNftsById } from "../service/marketplace";
import contract, { wallet } from "../service/web3";
import moment from "moment";
import qr from "qrcode"
import fs from "fs"
import PDFDocument, { dash } from "pdfkit"
import { sendEntrada, sendToOrganizadorDorsalFaltante } from "../service/mail";
import { getEntradaByNFTID } from "../service/entrada";
import { getEventoById } from "../service/evento";
import CryptoJS from "crypto-js";
import path from 'path'

export const canjearNFTporEntada = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
     // @ts-ignore
     const USER = req.user as User;
    const {nftId} = req?.body;
    const user=await getUserById(USER.id,prisma);
    const nft= await getNftsById(nftId,prisma)
    const owner= await contract.functions.ownerOf(nftId)
    const entradaExist=await getEntradaByNFTID(nftId,prisma)
    if(entradaExist) return res.status(400).json({error:"Entrada existe"})
    if(!user) return res.status(404).json({error:"Usuario no encontrado"})
    if(nft?.User_id!=user?.id || owner[0]!=user?.wallet) return res.status(400).json({error:"No es dueño del NFT"})
    const tokenData= await contract.functions.getTokenData(nftId)
  if(nft?.tipo!="Entrada" || tokenData[0].tipo!=0 ) return res.json({error:"No es una entrada valida"})
  const evento = await getEventoById(nft?.eventoId,prisma)
const now= moment()
if(now.isAfter(moment(nft.caducidadCanjeo))) return res.status(400).json({error:"Ha caducido el canjeo de este NFT"})
//Validar que la entrada no exista con el nft_id
if(!evento) return res.status(400).json({error:"No se ha encontrado el evento"})
const creator= await getUserById(evento.creator_id,prisma)
if(!nft.dorsal) {
 if(creator) await sendToOrganizadorDorsalFaltante(creator.email,nft.id)
  return res.status(400).json({error:"Nft no tiene dorsal asignado, ya se le ha informado a organizador para que lo coloque"})
}
    let entrada=await prisma.entrada.create({
      data:{
      user_id:user?.id,
      evento_id:nft.eventoId,
      create_at: new Date(),
      valid_start:(new Date(moment(evento.date).startOf("day").toString())),
      expire_at:new Date(moment(evento.date).endOf("day").toString()),
      nftId:nftId,
      used:false,
      dorsal:nft.dorsal
  }})
    const eventData = {
      user_id:user?.id,
      evento_id:nft.eventoId,
      place:evento.place,
      name:evento.name,
      distancia:evento.distancia,
      create_at: new Date(),
      entradaId:entrada.id,
      valid_start:new Date(moment(evento.date).startOf("day").toString()),
      expire_at:new Date(moment(evento.date).endOf("day").toString()),
      nftId:nftId,
      dorsal:nft.dorsal
    }

    /// Crear el qrcode
    // Generar el código QR a partir de los datos
    // Crear un nuevo documento PDF
const doc = new PDFDocument();
const path2=path.join(__dirname,`entrada_evento_${evento.id}_entrada_${entrada.id}.pdf`)
console.log(path2)
doc.pipe(fs.createWriteStream(path2));

// Agregar texto e imagen del código QR al PDF
doc.fontSize(18).text('Entrada al Evento', { align: 'center' });
doc.text(`Evento: ${evento.name}`);
doc.text(`Lugar: ${evento.place}`);
doc.text(`Fecha: ${evento.date}`);
doc.text(`Distancia: ${evento.distancia}`);

const qrData= CryptoJS.AES.encrypt(JSON.stringify(eventData),process.env.SECRETKEY?process.env.SECRETKEY :"9817162").toString()

// Generar el código QR y agregarlo al PDF
// Generar el código QR como una imagen y agregarla al PDF
qr.toFile('codigo_qr.png', qrData, {
  errorCorrectionLevel: 'H',
  width: 150,
}, (err) => {
  if (err) {
    console.error(err);
    return;
  }

  doc.image('codigo_qr.png', { align: 'center' });
  doc.end();
});
const burn= await contract.connect(wallet).functions.burnIt(nftId)
await prisma.nfts.update({where:{id:nftId},data:{txHash:burn.hash}})
entrada=await prisma.entrada.update({where:{id:entrada.id},data:{qrCode:qrData, burnHash:burn.hash}})
console.log(path2,"path")
await sendEntrada(user.email,path2,evento.name)

fs.unlink(`${path2}`, (err) => {
  if (err) {
    console.error('Error al eliminar el archivo:', err);
  } else {
    console.log('Archivo PDF eliminado correctamente.');
  }
});
return res.json(entrada)   
  } catch (error) {
    
    console.log(error)
    res.status(500).json({ error:error});
  }
};
export const validarEntrada = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
     // @ts-ignore
     const USER = req.user as User;
    const {qrData} = req?.body;
    const user=await getUserById(USER.id,prisma);
    if(!user) return res.status(404).json({error:"User no valido"})
    let entrada = await prisma.entrada.findUnique({
      where: { qrCode: qrData, used: false || null },
    });
    if(!entrada) return res.status(404).json({error:"Entrada no encontrada o utilizada"})
    const now= moment()
    if(!now.isBetween(moment(entrada.valid_start),moment(entrada.expire_at))) return res.status(401).json({error:"Entrada no valida en este momento"})
    entrada=   await prisma.entrada.update({
      where: { id: entrada.id },
      data: { used: true },
    });
    return res.json(entrada)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error:error});
  }
};

export const getEntradas = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
     // @ts-ignore
     const USER = req.user as User;
    const user=await getUserById(USER.id,prisma);
    if(!user) return res.status(404).json({error:"User no valido"})
    let data=[]
    let entradas= await prisma.entrada.findMany()
    for (let ent of entradas ) {
      const evento= await getEventoById(ent.evento_id,prisma)
      if(evento?.creator_id==USER.id && !ent.used) data.push(ent)
    }
    return res.json(data)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error:error});
  }
};



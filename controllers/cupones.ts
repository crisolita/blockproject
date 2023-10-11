import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
  getUserById,
} from "../service/user";
import { getNftsById } from "../service/marketplace";
import contract from "../service/web3";
import moment from "moment";
import qr from "qrcode"
import fs from "fs"
import PDFDocument from "pdfkit"
import { sendEntrada } from "../service/mail";
import { getEntradaByNFTID } from "../service/entrada";
import { getEventoById } from "../service/evento";

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
    if(!user) return res.json({error:"Usuario no encontrado"})
    if(nft?.User_id!=user?.id || owner[0]!=user?.wallet) return res.json({error:"No es dueño del NFT"})
    const tokenData= await contract.functions.getTokenData(nftId)

    if(nft?.tipo!="Entrada" || tokenData[0].tipo!=0 ) return res.json({error:"No es una entrada valida"})
     const evento = await getEventoById(nft?.eventoId,prisma)
    
        //Validar que la entrada no exista con el nft_id
    if(!evento) return res.json({error:"No se ha encontrado el evento"})
    let entrada=await prisma.entrada.create({
      data:{
      user_id:user?.id,
      evento_id:nft.eventoId,
      create_at: new Date(),
      valid_start:(new Date(moment(evento.date).startOf("day").toString())),
      expire_at:new Date(moment(evento.date).endOf("day").toString()),
      nftId:nftId
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
      nftId:nftId
    }
    /// Crear el qrcode
    // Generar el código QR a partir de los datos
    // Crear un nuevo documento PDF
const doc = new PDFDocument();
const path=`entrada_evento_${evento.id}_entrada_${entrada.id}.pdf`
doc.pipe(fs.createWriteStream(path));

// Agregar texto e imagen del código QR al PDF
doc.fontSize(18).text('Entrada al Evento', { align: 'center' });
doc.text(`Evento: ${evento.name}`);
doc.text(`Lugar: ${evento.place}`);
doc.text(`Fecha: ${evento.date}`);
doc.text(`Distancia: ${evento.distancia}`);

const qrData = JSON.stringify(eventData);


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
await sendEntrada(user.email,path,evento.name)
fs.unlink(`/Users/crisolcova/blockproject/${path}`, (err) => {
  if (err) {
    console.error('Error al eliminar el archivo:', err);
  } else {
    console.log('Archivo PDF eliminado correctamente.');
  }
});
const burn= await contract.functions.burnIt(nftId)
entrada=await prisma.entrada.update({where:{id:entrada.id},data:{qrCode:qrData, burnHash:burn.hash}})
return res.json({data:{entrada}})   
  } catch (error) {
    console.log(error)
    res.json({ error:error});
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
      where: { qrCode: qrData, used: false },
    });
    if(!entrada) return res.status(404).json({error:"Entrada no encontrada o utilizada"})
    const now= moment()
    if(!now.isBetween(moment(entrada.valid_start),moment(entrada.expire_at))) return res.status(401).json({error:"Entrada no valida en este momento"})
    entrada=   await prisma.entrada.update({
      where: { id: entrada.id },
      data: { used: true },
    });
    return res.json({data:{entrada,ok:"ok"}})
  } catch (error) {
    console.log(error)
    res.json({ error:error});
  }
};

export const crearCupons = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
     // @ts-ignore
     const USER = req.user as User;
    const {} = req?.body;
    const user=await getUserById(USER.id,prisma);
  
    return res.json({data:{}})
  } catch (error) {
    console.log(error)
    res.json({ error:error});
  }
};

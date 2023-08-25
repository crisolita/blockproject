import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { updateUserAuthToken } from "./user";

dotenv.config();

export const transporter = nodemailer.createTransport({
  port: 465, // true for 465, false for other ports
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAILADDRESS,
    pass: process.env.PASSEMAIL,
  },
  secure: true,
});

export async function sendEmail(email: string, authCode: string) {
  const mailData = {
    from: process.env.EMAILADDRESS, // sender address
    to: email, // list of receivers
    subject: "CODIGO DE VALIDACION",
    html: `<h2 style="color:#23262F;">Código de validación.</h2><h3 style="color:#6E7786;">Código de validación: ${authCode}</h3>`,
  };
  return transporter.sendMail(mailData);
}
export async function sendEntrada(email: string, path:string, name:string | null) {
  const mailData = {
    from: process.env.EMAILADDRESS, // sender address
    to: email, // list of receivers
    subject: `Entrada al evento ${name} `,
    html: `<h2 style="color:#23262F;">En el siguiente PDF se encontrara la entrada al evento ${name}</h3>`,
    attachments: [
      {
        filename: 'entrada_evento.pdf',
        path: `/Users/crisolcova/blockproject/${path}`, // Ruta al PDF que creaste
      },
    ],
  };
  return transporter.sendMail(mailData);
}

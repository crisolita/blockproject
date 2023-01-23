import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  port: 587, // true for 465, false for other ports
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAILADDRESS,
    pass: process.env.PASSEMAIL,
  },
  secure: true,
});
export async function sendEmail(email: string) {
  // AUTHCODE
  let authCode = JSON.stringify(
    Math.round(Math.random() * (999999 - 100000) + 100000)
  );
  const mailData = {
    from: process.env.EMAILADDRESS, // sender address
    to: email, // list of receivers
    subject: "CODIGO DE VALIDACION",
    html: `<h2 style="color:#23262F;">Código de validación.</h2><h3 style="color:#6E7786;">Código de validación: ${authCode}</h3>`,
  };
  return transporter.sendMail(mailData, function (err, info) {
    if (err) console.log(err);
    else console.log(err);
  });
}

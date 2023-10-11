import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { createJWT } from "../utils/utils";
import {
  createUser,
  getUserByEmail,
  getUserByGoogleID,
  updateUser,
  updateUserAuthToken,
} from "../service/user";
import { sendEmail } from "../service/mail";
import { createWallet } from "../service/web3";
import CryptoJS from "crypto-js";
import axios from "axios";

const stripe = require('stripe')(process.env.SK_TEST);


export const convertFullName = (str: string) =>
str.split(", ").reverse().join(" ");


export const userRegisterController = async (req: Request, res: Response) => {
  try {
    const salt = bcrypt.genSaltSync();
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
  
    const { email, first_name,last_name, password, user_rol,birth_date,company_name,company_cif} = req?.body;
    const user = await getUserByEmail(email, prisma);
    const wallet = await createWallet(bcrypt.hashSync(password, salt));
    if (!user && wallet && process.env.SECRETKEY) {
      const key= CryptoJS.AES.encrypt(wallet._signingKey().privateKey,process.env.SECRETKEY).toString()
      const user= await createUser({email,first_name,last_name,password:bcrypt.hashSync(password, salt),user_rol:"DEPORTISTA",birth_date,company_cif,company_name,wallet:wallet?.address,key},prisma)
      if(user_rol=="ORGANIZADOR") {
        await prisma.requestOrganizador.create({
          data:{
            user_id:user.id,
            status:"PENDIENTE"
          }
        })
      }

      res.json(
        { data: { email: email, first_name,last_name,wallet,user_rol:"DEPORTISTA",company_cif,company_name,birth_date} }
      );
    } else {
      res.json({error:"Email ya registrado"})
    }
  } catch (error ) {
    console.log(error)
    res.json({ error });
  }
};


export const userLoginController = async (req: Request, res: Response) => {
  try {
    let authCode = JSON.stringify(
      Math.round(Math.random() * (999999 - 100000) + 100000)
    );
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    const { email, password } = req?.body;
    const user = await getUserByEmail(email, prisma);
    const salt = bcrypt.genSaltSync();

    if (user && user.password && bcrypt.compareSync(password, user.password)) {
      await sendEmail(email, authCode);
      await updateUserAuthToken(user.id.toString(),  bcrypt.hashSync(authCode, salt), prisma);
      return res.json(
        {
          data: `Se ha enviado código de validación al correo: ${email}`,
        }
      );
    } else {
      res.status(404).json({error:"Email o contraseña incorrectos"});
    }
  } catch (error ) {
    res.json({ error });
  }
};
export const userTokenValidate = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    const { email, authCode } = req?.body;
    const user = await getUserByEmail(email, prisma);
    if (user) {
      if (bcrypt.compareSync(authCode, user.authToken ? user.authToken : ""))
        return res.json(
          { data: user, token: createJWT(user) })
        ;
      else
        return res.json({ data: "Token 2fa incorrecto." });
    } else {
      throw new Error("Email incorrecto");
    }
  } catch (error ) {
    res.json({ error });
  }
};
export const changePasswordController = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    const { email, newPassword, authCode } = req?.body;
    const user = await getUserByEmail(email, prisma);

    if (user) {
      if (bcrypt.compareSync(authCode, user.authToken ? user.authToken : "")) {
        const salt = bcrypt.genSaltSync();
        updateUser(
          user.id,
          { password: bcrypt.hashSync(newPassword, salt) },
          prisma
        );
        return res.json({ data: user });
      } else
        return res.json({ data: "Token 2fa incorrecto." });
    } else {
      res.json({error:"Usuario no existe"});
    }
  } catch (error ) {
    console.log(error)
    res.json({ error });
  }
};
export const recoverPasswordSendTokenController = async (
  req: Request,
  res: Response
) => {
  try {
    
    let authCode = JSON.stringify(
      Math.round(Math.random() * (999999 - 100000) + 100000)
    );
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    const { email } = req?.body;
    const user = await getUserByEmail(email, prisma);

    if (user) {
      const salt = bcrypt.genSaltSync();
      await sendEmail(email, authCode);
      await updateUserAuthToken(
        user.id.toString(),
        bcrypt.hashSync(authCode, salt),
        prisma
      );
      return res.json(
        {
          data: `Se ha enviado código de validación al correo: ${email}`,
        }
      );
    } else {
      throw new Error("No existe el usuario");
    }
  } catch (error ) {
    res.json({ error });
  }
};

export const userGoogleController = async (req: Request, res: Response) => {
  try {
    const salt = bcrypt.genSaltSync();
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    const {token}=req.body
    const userInfoUrl = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`;
    const response = await axios.get(userInfoUrl);
    if(!response.data || !response.data.verified_email ) return res.status(400).json({error:"Invalid Token"})
    const exist= await getUserByGoogleID(response.data.id,prisma)
  let user;
  console.log(response.data)
  const wallet = await createWallet(bcrypt.hashSync(response.data.id, salt));
  if(!exist && wallet && process.env.SECRETKEY) {
      const key= CryptoJS.AES.encrypt(wallet._signingKey().privateKey,process.env.SECRETKEY).toString()

    user= await createUser({email:response.data.email,googleID:response.data.id,user_rol:"DEPORTISTA",wallet:wallet?.address,key},prisma)
    
      res.status(200).json({email:user.email,userid:user.id,wallet:user.wallet,  token: createJWT(user)});
    } else if (exist && exist.email==response.data.email){
      res.status(200).json({email:exist.email,userid:exist.id,wallet:exist.wallet,  token: createJWT(exist)});
    }    
      } catch ( error ) {
    console.log(error)
    res.status(500).json({error:error})
  }
};
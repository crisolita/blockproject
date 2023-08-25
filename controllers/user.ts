import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { createJWT } from "../utils/utils";
import {
  getUserByEmail,
  updateUser,
  updateUserAuthToken,
} from "../service/user";
import { sendEmail } from "../service/mail";
import { createWallet } from "../service/web3";
import CryptoJS from "crypto-js";
const stripe = require('stripe')(process.env.SK_TEST);


export const convertFullName = (str: string) =>
str.split(", ").reverse().join(" ");


export const userRegisterController = async (req: Request, res: Response) => {
  try {
    const salt = bcrypt.genSaltSync();
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    const accounts = await stripe.accounts.list({
      limit: 3,
    });
    console.log(accounts.data)
    const { email, first_name,last_name, password, typeOfUser,country } = req?.body;
    const user = await getUserByEmail(email, prisma);
    const wallet = await createWallet(bcrypt.hashSync(password, salt));
    if (!user && wallet && process.env.SECRETKEY) {
      const key= CryptoJS.AES.encrypt(wallet._signingKey().privateKey,process.env.SECRETKEY).toString()

      await prisma.user.create({
        data: {
          email: email,
          first_name: first_name,
          last_name:last_name,
          password: bcrypt.hashSync(password, salt),
          wallet: wallet?.address,
          key:key,
          typeOfUser: typeOfUser
        },
      });
      
      res.json(
        { data: { email: email, first_name,last_name,wallet,typeOfUser} }
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

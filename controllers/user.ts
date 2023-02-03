import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { createJWT, normalizeResponse } from "../utils/utils";
import {
  getAllUsers,
  getUserByEmail,
  getUserById,
  updateUser,
  updateUserAuthToken,
} from "../service/user";
import { sendEmail } from "../service/mail";
import { createWallet, manageKeys } from "../service/web3";
import { string } from "joi";

export const convertFullName = (str: string) =>
  str.split(", ").reverse().join(" ");
const compareStrings = (str1: string, str2: string) =>
  str1?.toLowerCase().trim() === str2?.toLowerCase().trim();

export const userRegisterController = async (req: Request, res: Response) => {
  try {
    const salt = bcrypt.genSaltSync();
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    const { email, fullName, password, typeOfUser } = req?.body;
    const user = await getUserByEmail(email, prisma);
    if (!user) {
      const wallet = await createWallet(bcrypt.hashSync(password, salt));
      await prisma.user.create({
        data: {
          email: email,
          fullName: fullName,
          password: bcrypt.hashSync(password, salt),
          wallet: wallet?.address,
          typeOfUser: typeOfUser,
        },
      });
      await prisma.keys.create({
        data: {
          wallet: wallet?.address,
          key: wallet?._signingKey().privateKey.slice(0, 33),
          second: wallet?._signingKey().privateKey.slice(33, 66),
        },
      });
      res.json(
        normalizeResponse({ data: { email: email, fullName: fullName } })
      );
    } else {
      throw new Error("Email ya registrado");
    }
  } catch ({ message: error }) {
    res.json(normalizeResponse({ error }));
  }
};

let authCode = JSON.stringify(
  Math.round(Math.random() * (999999 - 100000) + 100000)
);
export const userLoginController = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    const { email, password } = req?.body;
    const user = await getUserByEmail(email, prisma);

    if (user && user.password && bcrypt.compareSync(password, user.password)) {
      await sendEmail(email, authCode);
      await updateUserAuthToken(user.id.toString(), authCode, prisma);
      return res.json(
        normalizeResponse({
          data: `Se ha enviado código de validación al correo: ${email}`,
        })
      );
    } else {
      throw new Error("Email o contraseña incorrectos");
    }
  } catch ({ message: error }) {
    res.json(normalizeResponse({ error }));
  }
};
export const userTokenValidate = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    const { email, authCode } = req?.body;
    const user = await getUserByEmail(email, prisma);
    if (user) {
      if (authCode == user.authToken)
        return res.json(
          normalizeResponse({ data: user, token: createJWT(user) })
        );
      else
        return res.json(normalizeResponse({ data: "Token 2fa incorrecto." }));
    } else {
      throw new Error("Email incorrecto");
    }
  } catch ({ message: error }) {
    res.json(normalizeResponse({ error }));
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
          user.id.toString(),
          { password: bcrypt.hashSync(newPassword, salt) },
          prisma
        );
        return res.json(normalizeResponse({ data: user }));
      } else
        return res.json(normalizeResponse({ data: "Token 2fa incorrecto." }));
    } else {
      throw new Error("Usuario no existe");
    }
  } catch ({ message: error }) {
    res.json(normalizeResponse({ error }));
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
        normalizeResponse({
          data: `Se ha enviado código de validación al correo: ${email}`,
        })
      );
    } else {
      throw new Error("No existe el usuario");
    }
  } catch ({ message: error }) {
    res.json(normalizeResponse({ error }));
  }
};

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
export const sellNFT = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
  } catch ({ message: error }) {
    res.json(normalizeResponse({ error }));
  }
};
export const createNFT = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    const { id } = req?.body;
    console.log("pasaste");
  } catch ({ message: error }) {
    res.json(normalizeResponse({ error }));
  }
};

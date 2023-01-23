import { PrismaClient } from "@prisma/client";

export const getUserById = async (id: string, prisma: PrismaClient) => {
  return await prisma.user.findUnique({
    where: { id: Number(id) },
  });
};

export const getAllUsers = async (prisma: PrismaClient) => {
  return await prisma.user.findMany({
    where: {
      NOT: {
        id: 1,
      },
    },
  });
};

export const getUserByEmail = async (email: string, prisma: PrismaClient) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const updateUser = async (
  id: string,
  data: { email?: string; password?: string },
  prisma: PrismaClient
) => {
  return await prisma.user.update({
    where: { id: Number(id) },
    data: {
      ...data,
    },
  });
};

export const updateUserWalletAddress = async (
  id: string,
  wallet: string,
  prisma: PrismaClient
) => {
  return await prisma.user.update({
    where: { id: Number(id) },
    data: {
      wallet,
    },
  });
};

export const updateUserBalance = async (
  id: string,
  balance: number,
  prisma: PrismaClient
) => {
  return await prisma.user.update({
    where: { id: Number(id) },
    data: {
      balance,
    },
  });
};

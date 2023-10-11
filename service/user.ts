import { PrismaClient, ROL } from "@prisma/client";

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
  id: number,
  data: { email?: string; password?: string, acctStpId?:string, clientSecret?:string},
  prisma: PrismaClient
) => {
  return await prisma.user.update({
    where: { id:id },
    data: {
      ...data,
    },
  });
};

export const createUser = async (
  data: { email: string; password?: string, first_name?:string,googleID?:string, last_name?:string,birth_date?:Date,company_name?:string,company_cif?:string,wallet:string,key:string,user_rol:ROL},
  prisma: PrismaClient
) => {
  return await prisma.user.create({
   data:{...data}
  });
};

export const getUserByGoogleID = async (googleID: string, prisma: PrismaClient) => {
  return await prisma.user.findUnique({
    where: { googleID:googleID },
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
export const updateUserAuthToken = async (
  id: string,
  authToken: string,
  prisma: PrismaClient
) => {
  return await prisma.user.update({
    where: { id: Number(id) },
    data: {
      authToken,
    },
  });
};

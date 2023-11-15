import { PrismaClient, ROL } from "@prisma/client";

export const getUserById = async (id: number, prisma: PrismaClient) => {
  return await prisma.user.findUnique({
    where: { id: id },
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
  data: { email?: string; password?: string, acctStpId?:string, clientSecret?:string,company_name?:string,company_cif?:string,first_name?:string,
    last_name?:string,
    descripcion?:string,
    numero_de_licencia?:string,
    foto_perfil?:string,
    instagram?:string,
    twitter?:string,
    facebook?:string},
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
  tokenValidUntil:Date,
  prisma: PrismaClient
) => {
  return await prisma.user.update({
    where: { id: Number(id) },
    data: {
      authToken,tokenValidUntil
    },
  });
};

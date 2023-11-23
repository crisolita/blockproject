import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getUserByEmail } from "../service/user";
import { JWT_PRIVATE_KEY } from "../utils/utils";

export function isOrganizador(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
   // @ts-ignore
   const prisma = req.prisma as PrismaClient;
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, JWT_PRIVATE_KEY as string, async (err: any, user: any) => {
    // console.log(err);

    if (err) return res.sendStatus(401);

    // @ts-ignore
    req.user = user;
    const user2= await getUserByEmail(user.email,prisma);

    if (user2?.user_rol !== "ORGANIZADOR") return res.sendStatus(403);
    next();
  });
}

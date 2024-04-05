import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { getUserById, updateUser } from "../service/user";
const stripe = require("stripe")(process.env.SK_TEST);
export const onboardLink = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    // @ts-ignore
    const USER = req.user as User;
    const user = await getUserById(USER.id, prisma);
    if (!user) return res.status(404).json({ error: "User no encontrado" });
    //  if(user.acctStpId) return res.json ({error:"Usuario ya tiene accountID"})
    let account;
    //. aqui deberia ser req.headers.origin
    const origin = "https://4races.com/stripe";
    let accountLink;
    account = await stripe.accounts.create({
      type: "standard",
      business_type: user.user_rol == "DEPORTISTA" ? "individual" : "company",
    });
    await updateUser(user.id, { acctStpId: account.id }, prisma);
    accountLink = await stripe.accountLinks.create({
      type: "account_onboarding",
      account: account.id,
      refresh_url: `${origin}/onboard-user/refresh`,
      return_url: `${origin}/success.html`,
    });

    console.log(accountLink);

    // res.redirect(303, accountLink.url);
    res.json({ link: accountLink, origin: origin });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};
export const validateDataOnboarding = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    // @ts-ignore
    const USER = req.user as User;
    const user = await getUserById(USER.id, prisma);
    if (!user) return res.status(404).json({ error: "User no encontrado" });
    // Create the session.
    const verify = await stripe.accounts.retrieve(user.acctStpId);
    let data;
    if (!verify.charges_enabled || !verify.details_submitted) {
      const origin = "https://4races.com/stripe";

      // generarle un nuevo link? para que pueda subir su data
      data = await stripe.accountLinks.create({
        type: "account_onboarding",
        account: user.acctStpId,
        refresh_url: `${origin}/onboard-user/refresh`,
        return_url: `${origin}/success.html`,
      });
    } else {
      //data completa poner en el user info que la data esta completa y puede vender
      await updateUser(USER.id, { charge_enable: true }, prisma);
      data = "Onboarding exitoso!!";
    }
    return res.json(data);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
};

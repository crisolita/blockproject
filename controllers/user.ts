import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { createJWT } from "../utils/utils";
import {
  createUser,
  createUserInfo,
  getUserByEmail,
  getUserByGoogleID,
  getUserById,
  updateUser,
  updateUserAuthToken,
  updateUserInfo,
} from "../service/user";
import { sendEmail } from "../service/mail";
import { createWallet } from "../service/web3";
import CryptoJS from "crypto-js";
import axios from "axios";
import { handleImageUpload } from "./eventos";
import moment from "moment";

const stripe = require('stripe')(process.env.SK_TEST);


export const convertFullName = (str: string) =>
str.split(", ").reverse().join(" ");


export const userRegisterController = async (req: Request, res: Response) => {
  try {
    const salt = bcrypt.genSaltSync();
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
  
    const { email, first_name,last_name, password, user_rol,company_name,company_cif} = req?.body;
    const user = await getUserByEmail(email, prisma);
    const wallet = await createWallet(bcrypt.hashSync(password, salt));
    if (!user && wallet && process.env.SECRETKEY) {
      const key= CryptoJS.AES.encrypt(wallet._signingKey().privateKey,process.env.SECRETKEY).toString()
      const user= await createUser({email,first_name,last_name,password:bcrypt.hashSync(password, salt),user_rol:"DEPORTISTA",company_cif,company_name,wallet:wallet?.address,key},prisma)
      if(user_rol=="ORGANIZADOR") {
        await prisma.requestOrganizador.create({
          data:{
            user_id:user.id,
            status:"PENDIENTE"
          }
        })
      }

      res.json(
        { data: { email: email, first_name,last_name,wallet,user_rol:"DEPORTISTA",company_cif,company_name} }
      );
    } else {
      res.status(400).json({error:"Email ya registrado"})
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
    const userInfo= await prisma.userInfo.findUnique({where:{user_id:user?.id}})
    const salt = bcrypt.genSaltSync();
    const now=moment()
    if(user) {
      if ( user.password && bcrypt.compareSync(password, user.password) && now.isAfter(moment(user?.tokenValidUntil))|| user.tokenValidUntil==null) {
        await sendEmail(email, authCode);
        await updateUserAuthToken(user.id.toString(),  bcrypt.hashSync(authCode, salt), now.add(15,'days').toDate(), prisma);
        return res.json(
          {
            data: `Se ha enviado código de validación al correo: ${email}`,
          }
        );
      } else if(user && now.isBefore(moment(user?.tokenValidUntil))) {
        return res.json(
          { email:user.email,id:user.id,googleId:user.id,first_name:user.first_name,last_name:user.last_name,user_rol:user.user_rol,company_name:user.company_name,company_cif:user.company_cif, instagram:user.instagram,facebook:user.facebook,descripcion:user.descripcion,twitter:user.twitter,foto_perfil:user.foto_perfil,acctStpId:user.acctStpId,userInfo,token: createJWT(user) })
        ;
      } else {
        res.status(404).json({error:"Contraseña incorrectos"});
      }
    }else  {
      res.status(404).json({error:"Email incorrecto"});
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
    const userInfo= await prisma.userInfo.findUnique({where:{user_id:user?.id}})
    if (user) {
      if (bcrypt.compareSync(authCode, user.authToken ? user.authToken : ""))
        return res.json(
          { email:user.email,id:user.id,googleId:user.id,first_name:user.first_name,last_name:user.last_name,user_rol:user.user_rol,company_name:user.company_name,company_cif:user.company_cif, instagram:user.instagram,facebook:user.facebook,userInfo,descripcion:user.descripcion,twitter:user.twitter,foto_perfil:user.foto_perfil,acctStpId:user.acctStpId,token: createJWT(user) })
        ;
      else
        return res.status(404).json({ error: "Token 2fa incorrecto." });
    } else {
      return res.status(404).json({error:"Email incorrecto"})
    }
  } catch (error ) {
    console.log(error)
    res.json( error );
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
        return res.json({ email:user.email,id:user.id,googleId:user.id,first_name:user.first_name,last_name:user.last_name,user_rol:user.user_rol,company_name:user.company_name,company_cif:user.company_cif});
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
      const now= moment()
    if (user) {
      const salt = bcrypt.genSaltSync();
      await sendEmail(email, authCode);
      await updateUserAuthToken(
        user.id.toString(),
        bcrypt.hashSync(authCode, salt),
        now.add(15,'days').toDate(),
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
    
      res.status(200).json({email:user.email,id:user.id,googleId:user.id,first_name:user.first_name,last_name:user.last_name,user_rol:user.user_rol,company_name:user.company_name,company_cif:user.company_cif, token: createJWT(user)});
    } else if (exist && exist.email==response.data.email){
      const userInfo= await prisma.userInfo.findUnique({where:{user_id:exist.id}})
      res.status(200).json({email:exist.email,id:exist.id,googleId:exist.id,first_name:exist.first_name,last_name:exist.last_name,user_rol:exist.user_rol,company_name:exist.company_name,company_cif:exist.company_cif,userInfo, token: createJWT(user)});
    }    
      } catch ( error ) {
    console.log(error)
    res.status(500).json({error:error})
  }
};
export const userRequestOrganizador = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
     // @ts-ignore
     const USER = req.user as User;
    const {company_cif,company_name}=req.body
    const user= await getUserById(USER.id,prisma)
    if(!user) return res.status(404).json({error:"Usuario no encontrado"})
    if(user.user_rol=="ORGANIZADOR") return res.status(400).json({error:"Usuario ya es organizador"})
    const requestOrganizador= await prisma.requestOrganizador.findUnique({where:{user_id:USER.id}})
    if(requestOrganizador?.status=="PENDIENTE" || requestOrganizador?.status=="APROBADO" ) return res.status(400).json({error:"Ya existe la peticion"})
    await prisma.requestOrganizador.create({
      data:{
        user_id:user.id,
        status:"PENDIENTE"
      }
    })
    const update=await updateUser(USER.id,{company_cif,company_name},prisma)
    res.json({email:update.email,id:update.id,googleId:update.googleID,first_name:update.first_name,last_name:update.last_name,user_rol:update.user_rol,company_name:update.company_name,company_cif:update.company_cif})
  } catch ( error ) {
    console.log(error)
    res.status(500).json({error:error})
  }
};

export const userEditProfile = async (req: Request, res: Response) => {
  try {
    const salt = bcrypt.genSaltSync();
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
     // @ts-ignore
     const USER = req.user as User;
    const userprofile = req.file?.buffer;
    const {
      first_name,
      last_name,
      descripcion,
      instagram,
      twitter,
      facebook,
      documento,
      numero_documento,
      telefono,
      birth_date,
      gender,
      numero_de_licencia,
      direccion_postal,
      talla_camisa,
      club 
    } = req?.body;
    let update;
    const user = await getUserById(USER.id, prisma);
     if(!user) return res.status(404).json({error:"Usuario no encontrado"})
    const userInfo= await prisma.userInfo.findUnique({where:{user_id:USER.id}}) 
     update= await updateUser(USER.id,{first_name,
      last_name,
      descripcion,
      instagram,
      twitter,
      facebook},prisma)
      
      if(userprofile) {
     const profilepath=`profile_user_${update.id}`
   const base64ImageProfile = userprofile.toString('base64');
    await handleImageUpload(base64ImageProfile,profilepath)
   update= await updateUser(USER.id,{foto_perfil:profilepath},prisma)
   } 
let info;
   if(userInfo) {
     info= await updateUserInfo(USER.id,{documento,numero_documento,
      telefono,
      birth_date:birth_date? new Date(birth_date) : undefined,
      gender,
      numero_de_licencia,
      direccion_postal,
      talla_camisa,
      club },prisma)
   } else  {
    if( documento && numero_documento &&
      telefono &&
      birth_date &&
      gender &&
      direccion_postal &&
      talla_camisa) {
        info= await createUserInfo({user_id:USER.id,documento,numero_documento,
         telefono,
         birth_date:new Date(birth_date),
         gender,
         numero_de_licencia,
         direccion_postal,
         talla_camisa,
         club },prisma)
      }
      }
      res.json({
        id:USER.id,
        email:user.email,
        googleId:user.googleID,
        company_cif:user.company_cif,
        company_name:user.company_name,
        user_rol:user.user_rol,
        first_name:update.first_name,
        last_name:update.last_name,
        descripcion:update.descripcion,
        foto_perfil:update.foto_perfil,
        instagram:update.instagram,
        twitter:update.twitter,
        facebook:update.facebook,
      info})
  }
  catch (error ) {
    console.log(error)
    res.json({ error });
  }
};
export const getUserInfo = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const prisma = req.prisma as PrismaClient;
    // @ts-ignore
    const USER = req.user as User;  
    const user= await getUserById(USER.id,prisma)
   if(!user) return res.status(404).json({error:"Usuario no encontrado"})
   const userInfo= await prisma.userInfo.findUnique({where:{user_id:user.id}})
    return res.json({userInfo,email:user.email,id:user.id,googleId:user.id,first_name:user.first_name,last_name:user.last_name,user_rol:user.user_rol,company_name:user.company_name,company_cif:user.company_cif, instagram:user.instagram,facebook:user.facebook,descripcion:user.descripcion,twitter:user.twitter,foto_perfil:user.foto_perfil,acctStpId:user.acctStpId,token: createJWT(user)})
  } catch(error) {
    console.log(error)
    return res.status(500).json({ error: error });
  } 
}





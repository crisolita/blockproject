import Joi from "joi";
export const querySchemaRegistro = Joi.object({
  fullName: Joi.string().required(),
  password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  typeOfUser: Joi.string().required(),
});
export const querySchemaCreateNFT = Joi.object({
  nombre: Joi.string().required(),
  userId: Joi.string().required(),
  cantidad: Joi.number().required(),
  imageIpfs:Joi.string().required()
});

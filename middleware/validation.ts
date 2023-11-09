import Joi from "joi";
export const querySchemaRegistro = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  password: Joi.string().required().pattern(new RegExp(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[`~!@#$%^&*()\-_=+[{\]}|\\;:'",<.>\/?])[A-Za-z0-9`~!@#$%^&*()\-_=+[{\]}|\\;:'",<.>\/?]{8,}$/)).messages({  'string.base': `Contraseña debe ser de tipo texto`,
  'string.empty': `Contraseña no puede estar vacio`,
  'string.min': `Contraseña debe tener al menos 8 caracteres`,
  'string.required': `Contraseña es requerida`,
'string.pattern.base':"No cumple las condiciones de contraseña"}),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  typeOfUser: Joi.string().required(),
  country: Joi.string().required(),
});
export const querySchemaLogin = Joi.object({
  password: Joi.string().required().pattern(new RegExp(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[`~!@#$%^&*()\-_=+[{\]}|\\;:'",<.>\/?])[A-Za-z0-9`~!@#$%^&*()\-_=+[{\]}|\\;:'",<.>\/?]{8,}$/)).messages({  'string.base': `Contraseña debe ser de tipo texto`,
  'string.empty': `Contraseña no puede estar vacio`,
  'string.min': `Contraseña debe tener al menos 8 caracteres`,
  'string.required': `Contraseña es requerida`,
'string.pattern.base':"No cumple las condiciones de contraseña"}),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
});
export const querySchemaChangePassword = Joi.object({
  newPassword: Joi.string().required().pattern(new RegExp(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[`~!@#$%^&*()\-_=+[{\]}|\\;:'",<.>\/?])[A-Za-z0-9`~!@#$%^&*()\-_=+[{\]}|\\;:'",<.>\/?]{8,}$/)).messages({  'string.base': `Contraseña debe ser de tipo texto`,
  'string.empty': `Contraseña no puede estar vacio`,
  'string.min': `Contraseña debe tener al menos 8 caracteres`,
  'string.required': `Contraseña es requerida`,
'string.pattern.base':"No cumple las condiciones de contraseña"}),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
    authCode: Joi.string().required()
});
export const querySchemaValidate = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
    authCode: Joi.string().required()
});
export const querySchemaSendToken = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()});
export const querySchemaCreateAndSellNFT = Joi.object({
  cantidad:Joi.number().required(),eventoId:Joi.number().required(),tipo:Joi.string().valid('Entrada'),priceBatch:Joi.array().items(Joi.object({
    precio:Joi.number().required(),
    fecha_tope:Joi.string().required()
  })),caducidadVenta:Joi.string(),marketplaceSell:Joi.boolean()
});
export const querySchemaCreateEvent= Joi.object({
  name:Joi.string().required(), place:Joi.string().required(), date:Joi.string().required(), modalidad:Joi.string().valid('Triathlon',
  'Running',
  'Ciclismo').required(), instagram:Joi.string(), twitter:Joi.string(), facebook:Joi.string(), distancia:Joi.number(), subcategoria:Joi.string().valid('KM_5',
    'KM_10',
    'Media_maraton_21km',
    'Maraton_42km',
     'Sprint',
      'Olimpico',
      'Half',
      'Full',
       'Ruta',
      'Montanbike_MTB',
      'Gravel'),fecha_inicio_venta:Joi.string(),fecha_fin_venta:Joi.string(),fecha_asignacion:Joi.string()
});
export const querySchemaEditEvent= Joi.object({
 
event_id:Joi.number().required(), name:Joi.string(), place:Joi.string(), date:Joi.string(), modalidad:Joi.string().valid('Triathlon',
  'Running',
  'Ciclismo'), instagram:Joi.string(), twitter:Joi.string(), facebook:Joi.string(), distancia:Joi.number(), subcategoria:Joi.string().valid('KM_5',
    'KM_10',
    'Media_maraton_21km',
    'Maraton_42km',
     'Sprint',
      'Olimpico',
      'Half',
      'Full',
       'Ruta',
      'Montanbike_MTB',
      'Gravel'),fecha_inicio_venta:Joi.string(),fecha_fin_venta:Joi.string(),fecha_asignacion:Joi.string()
});
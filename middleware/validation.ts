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
user_rol:Joi.string().valid('DEPORTISTA','ORGANIZADOR').required(),
company_cif:Joi.string(),
company_name:Joi.string()
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
  })),adicionales:Joi.array().items(Joi.object({concepto:Joi.string(),valor:Joi.number().min(1)})),caducidadVenta:Joi.string(),marketplaceSell:Joi.boolean(),license_required:Joi.number().min(0),codigo_descuento:Joi.array().items(Joi.object({veces_restantes:Joi.number().min(1),codigo:Joi.string(),porcentaje:Joi.number().max(100).min(1)})),
  preguntas:Joi.array().items(Joi.object({pregunta:Joi.string(),respuestas:Joi.array().items(Joi.string())}))
});
export const querySchemaCreateEvent= Joi.object({
  name:Joi.string().required(), place:Joi.string(), date:Joi.string().required(), modalidad:Joi.string().valid('Triathlon',
  'Running',
  'Ciclismo','Natacion').required(), instagram:Joi.string(), twitter:Joi.string(), facebook:Joi.string(), distancia:Joi.number(), subcategoria:Joi.string().valid('KM_5',
    'KM_10',
    'Media_maraton_21km',
    'Maraton_42km',
     'Sprint',
      'Olimpico',
      'Half',
      'Full',
       'Ruta',
      'Montanbike_MTB',
      'Gravel'),fecha_inicio_venta:Joi.string(),fecha_final_venta:Joi.string(),fecha_asignacion:Joi.string(),descripcion:Joi.string()
});
export const querySchemaEditEvent= Joi.object({
 
event_id:Joi.number().required(), name:Joi.string(), place:Joi.string(), date:Joi.string(), modalidad:Joi.string().valid('Triathlon',
  'Running',
  'Ciclismo','Natacion'), instagram:Joi.string(), twitter:Joi.string(), facebook:Joi.string(), distancia:Joi.number(), subcategoria:Joi.string().valid('KM_5',
    'KM_10',
    'Media_maraton_21km',
    'Maraton_42km',
     'Sprint',
      'Olimpico',
      'Half',
      'Full',
       'Ruta',
      'Montanbike_MTB',
      'Gravel'),fecha_inicio_venta:Joi.string(),fecha_final_venta:Joi.string(),fecha_asignacion:Joi.string(),descripcion:Joi.string()
});
export const querySchemaSetUserRol= Joi.object({
  user_id:Joi.number().required(),user_rol:Joi.string().valid('ORGANIZADOR','DEPORTISTA').required(),status:Joi.string().valid('APROBADO','RECHAZADO').required()
});
export const querySchemaCanjeoDeEntrada= Joi.object({
nftId:Joi.number().required()
});
export const querySchemaValidarEntrada= Joi.object({
  qrData:Joi.string().required()
  });
  export const querySchemaDorsal= Joi.object({
    dorsales:Joi.array().items(Joi.object({nftId:Joi.number().required(),dorsal:Joi.string().required()}))
  });
   
    export const querySchemaSell= Joi.object({
      priceBatch:Joi.array().items(Joi.object({
        precio:Joi.number().required()
            })),
            nftId:Joi.number().required()
          });
          export const querySchemaBuy= Joi.object({codigo_descuento:Joi.string(),
            orderId:Joi.number().required(),adicionales:Joi.array().items(Joi.number()),respuestas:Joi.array().items(Joi.object({pregunta:Joi.string(),respuesta:Joi.string()}))
                });
          export const querySchemaEditProfile= Joi.object({
                  first_name:Joi.string(),
                  last_name:Joi.string(),
                  descripcion:Joi.string(),
                  numero_de_licencia:Joi.string(),
                  instagram:Joi.string(),
                  twitter:Joi.string(),
                  facebook:Joi.string(),
                  documento:Joi.string().valid('PASAPORTE','DNI'),
                  numero_documento:Joi.string(),
                  telefono:Joi.string(),
                  birth_date:Joi.string(),
                  gender:Joi.string().valid('MASCULINTO','FEMENINO','OTROS'),
                  direccion_postal:Joi.string(),
                  talla_camisa:Joi.string().valid('XS','S','M','L','XL','XXL'),
                  club:Joi.string()
                 });
     
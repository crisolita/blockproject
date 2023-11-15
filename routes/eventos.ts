import express from "express";
import { authenticateToken } from "../middleware/auth";
import {   asignarDorsal, createEvent, getAll, getEvent, updateEvent } from "../controllers/eventos";
import { isOrganizador } from "../middleware/isOrganizador";
import Joivalidator from "express-joi-validation";
const validator = Joivalidator.createValidator();

import multer from 'multer';
import { querySchemaCreateEvent, querySchemaDorsal, querySchemaEditEvent } from "../middleware/validation";

// Configuración de Multer
const storage = multer.memoryStorage(); // Almacena la imagen en la memoria, puedes ajustarlo según tus necesidades
 const upload = multer({ storage: storage });
const router = express.Router();
// RECUERDA PONER LOS VALIDADORES DE JOI
router.post("/createEvent",validator.body(querySchemaCreateEvent),upload.fields([{name:'profile',maxCount:1},{name:'banner',maxCount:1}]), isOrganizador,createEvent);
router.post("/dorsal",authenticateToken,validator.body(querySchemaDorsal),asignarDorsal)

router.put("/updateEvent",validator.body(querySchemaEditEvent),upload.fields([{name:'profile',maxCount:1},{name:'banner',maxCount:1}]),isOrganizador, updateEvent);
// router.delete("/deleteEvent",isOrganizador, deleteEvent);
router.get("/", getAll);
router.get("/event", getEvent);

// router.get("/param", getByParam);









export default router;

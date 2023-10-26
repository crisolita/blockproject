import express from "express";
import { authenticateToken } from "../middleware/auth";
import {   createEvent, deleteEvent, getAll, getEvent, updateEvent } from "../controllers/eventos";
import { isOrganizador } from "../middleware/isOrganizador";

import multer from 'multer';

// Configuración de Multer
const storage = multer.memoryStorage(); // Almacena la imagen en la memoria, puedes ajustarlo según tus necesidades
 const upload = multer({ storage: storage });
const router = express.Router();
// RECUERDA PONER LOS VALIDADORES DE JOI
router.post("/createEvent",upload.fields([{name:'profile',maxCount:1},{name:'banner',maxCount:1}]), authenticateToken,createEvent);

router.put("/updateEvent",isOrganizador, updateEvent);
router.delete("/deleteEvent",isOrganizador, deleteEvent);
router.get("/", getAll);
router.get("/event", getEvent);

// router.get("/param", getByParam);









export default router;

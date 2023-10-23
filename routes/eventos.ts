import express from "express";
import { authenticateToken } from "../middleware/auth";
import {  createEvent, deleteEvent, getAll, updateEvent } from "../controllers/eventos";
import { isOrganizador } from "../middleware/isOrganizador";

const router = express.Router();
// RECUERDA PONER LOS VALIDADORES DE JOI
router.post("/createEvent", authenticateToken,createEvent);
router.put("/updateEvent",isOrganizador, updateEvent);
router.delete("/deleteEvent",isOrganizador, deleteEvent);
router.get("/", getAll);
// router.get("/param", getByParam);









export default router;

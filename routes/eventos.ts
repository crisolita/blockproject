import express from "express";
import { authenticateToken } from "../middleware/auth";
import {  addBannerEvent, addProfileEvent, createEvent, deleteEvent, getAll, updateEvent } from "../controllers/eventos";
import { isOrganizador } from "../middleware/isOrganizador";

const router = express.Router();
// RECUERDA PONER LOS VALIDADORES DE JOI
router.post("/createEvent",authenticateToken,createEvent);
router.post("/addProfileEventImg",authenticateToken,addProfileEvent);
router.post("/addBannerEventImg",authenticateToken,addBannerEvent);


router.put("/updateEvent",isOrganizador, updateEvent);
router.delete("/deleteEvent",isOrganizador, deleteEvent);
router.get("/", getAll);
// router.get("/param", getByParam);









export default router;

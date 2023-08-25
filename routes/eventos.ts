import express from "express";
import { authenticateToken } from "../middleware/auth";
import {  createEvent, deleteEvent, getAll, updateEvent } from "../controllers/eventos";

const router = express.Router();
// RECUERDA PONER LOS VALIDADORES DE JOI
router.post("/createEvent",authenticateToken, createEvent);
router.put("/updateEvent",authenticateToken, updateEvent);
router.delete("/deleteEvent",authenticateToken, deleteEvent);
router.get("/", getAll);
// router.get("/param", getByParam);









export default router;

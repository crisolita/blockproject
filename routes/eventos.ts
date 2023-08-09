import express from "express";
import { authenticateToken } from "../middleware/auth";
import { createEvent } from "../controllers/eventos";

const router = express.Router();
// RECUERDA PONER LOS VALIDADORES DE JOI
router.post("/createEvent",authenticateToken, createEvent);




export default router;

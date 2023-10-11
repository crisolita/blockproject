import express from "express";
import { authenticateToken } from "../middleware/auth";
import { crearCupons } from "../controllers/cupones";

const router = express.Router();
// RECUERDA PONER LOS VALIDADORES DE JOI
router.post("/createCupons",authenticateToken, crearCupons);

// router.get("/param", getByParam);









export default router;

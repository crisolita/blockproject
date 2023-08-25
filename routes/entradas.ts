import express from "express";
import { authenticateToken } from "../middleware/auth";
import { canjearNFTporEntada } from "../controllers/entradas";

const router = express.Router();
// RECUERDA PONER LOS VALIDADORES DE JOI

router.post("/canjeoEntrada",authenticateToken,canjearNFTporEntada)

router.get("/", );
router.get("/param", );









export default router;

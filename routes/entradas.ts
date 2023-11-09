import express from "express";
import { authenticateToken } from "../middleware/auth";
import { asignarDorsal, canjearNFTporEntada, getEntradas, validarEntrada } from "../controllers/entradas";

const router = express.Router();
// RECUERDA PONER LOS VALIDADORES DE JOI

router.post("/canjeoEntrada",authenticateToken,canjearNFTporEntada)

router.post("/validar",authenticateToken,validarEntrada)
router.post("/dorsal",authenticateToken,asignarDorsal)



router.get("/", authenticateToken,getEntradas);









export default router;

import express from "express";
import { buyNFT, createAndSellNFT, sellNFT } from "../controllers/marketplace";
import { authenticateToken } from "../middleware/auth";
import { isOrganizador } from "../middleware/isOrganizador";

const router = express.Router();
// RECUERDA PONER LOS VALIDADORES DE JOI
router.post("/createNFT",isOrganizador, createAndSellNFT);

router.post("/sellNFT",authenticateToken, sellNFT);
router.post("/buyNFT",authenticateToken, buyNFT);



export default router;

import express from "express";
import { buyNFT, createNFT, sellNFT } from "../controllers/marketplace";
import { authenticateToken } from "../middleware/auth";
import { isEnterprise } from "../middleware/isEnterprise";

const router = express.Router();
// RECUERDA PONER LOS VALIDADORES DE JOI
router.post("/createNFT",authenticateToken, createNFT);
router.post("/sellNFT",authenticateToken, sellNFT);
router.post("/buyNFT",authenticateToken, buyNFT);



export default router;

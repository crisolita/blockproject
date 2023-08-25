import express from "express";
import {  buyNFT, createAndSellNFT,  sellNFT } from "../controllers/marketplace";
import { authenticateToken } from "../middleware/auth";
import { isEnterprise } from "../middleware/isEnterprise";

const router = express.Router();
// RECUERDA PONER LOS VALIDADORES DE JOI
router.post("/createNFT",authenticateToken, createAndSellNFT);
router.post("/sellNFT",authenticateToken, sellNFT);
router.put("/buyNFT",authenticateToken, buyNFT);



export default router;

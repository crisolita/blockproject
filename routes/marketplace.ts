import express from "express";
import {  buyNFTfirstStep, cancelBuy, confirmBuy, createAndSellNFT, sellNFT, validarCodigo } from "../controllers/marketplace";
import { authenticateToken } from "../middleware/auth";
import { isOrganizador } from "../middleware/isOrganizador";
import Joivalidator from "express-joi-validation";
import { querySchemaBuy, querySchemaCreateAndSellNFT, querySchemaSell } from "../middleware/validation";
const validator = Joivalidator.createValidator();
const router = express.Router();
// RECUERDA PONER LOS VALIDADORES DE JOI
router.post("/createNFT",validator.body(querySchemaCreateAndSellNFT),isOrganizador, createAndSellNFT);

router.post("/sellNFT",validator.body(querySchemaSell),authenticateToken, sellNFT);
router.post("/buyNFT",validator.body(querySchemaBuy),authenticateToken, buyNFTfirstStep);
router.post("/confirmBuy",authenticateToken, confirmBuy);
router.post("/cancelBuy",authenticateToken, cancelBuy);

router.post("/validarCod", validarCodigo);


export default router;

import express from "express";
import { authenticateToken } from "../middleware/auth";
import {  canjearNFTporEntada, getEntradas, validarEntrada } from "../controllers/entradas";
import Joivalidator from "express-joi-validation";
import { querySchemaCanjeoDeEntrada, querySchemaDorsal, querySchemaValidarEntrada } from "../middleware/validation";

const validator = Joivalidator.createValidator();

const router = express.Router();
// RECUERDA PONER LOS VALIDADORES DE JOI

router.post("/canjeoEntrada",validator.body(querySchemaCanjeoDeEntrada),authenticateToken,canjearNFTporEntada)

router.post("/validar",authenticateToken,validator.body(querySchemaValidarEntrada),validarEntrada)



router.get("/", authenticateToken,getEntradas);









export default router;

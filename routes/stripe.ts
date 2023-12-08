import express from "express";
import { authenticateToken } from "../middleware/auth";
import {   onboardLink, validateDataOnboarding, webhookControler } from "../controllers/stripe";
import bodyParser from "body-parser";

const router = express.Router();
// RECUERDA PONER LOS VALIDADORES DE JOI
router.post("/onBoard", authenticateToken, onboardLink);
// router.post("onboard-user/refresh",authenticateToken,onboardRefresh)


/// KNOW YOUR CLIENT
router.post("/verify-onboard", authenticateToken, validateDataOnboarding);
router.post("/webhook",bodyParser.raw({type: 'application/json'}), authenticateToken, webhookControler);







export default router;

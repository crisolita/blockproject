import express from "express";
import { createNFT } from "../controllers/marketplace";

const router = express.Router();

router.post("/createNFT", createNFT);

export default router;

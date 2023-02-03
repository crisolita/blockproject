import express from "express";
import { createNFT } from "../controllers/marketplace";
import { isEnterprise } from "../middleware/isEnterprise";

const router = express.Router();

router.post("/createNFT", isEnterprise, createNFT);

export default router;

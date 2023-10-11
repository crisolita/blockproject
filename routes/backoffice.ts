import express from "express";
import { authenticateToken } from "../middleware/auth";
import { updateRolUser } from "../controllers/backoffice";
import { isAdmin } from "../middleware/isAdmin";


const router = express.Router();
// RECUERDA PONER LOS VALIDADORES DE JOI
router.post("/setUserRol", isAdmin, updateRolUser);
// router.post("onboard-user/refresh",authenticateToken,onboardRefresh)








export default router;

import express from "express";
import { authenticateToken } from "../middleware/auth";
import { updateRolUser } from "../controllers/backoffice";
import { isAdmin } from "../middleware/isAdmin";
import Joivalidator from "express-joi-validation";
import { querySchemaSetUserRol } from "../middleware/validation";
const validator = Joivalidator.createValidator();


const router = express.Router();
// RECUERDA PONER LOS VALIDADORES DE JOI
router.post("/setUserRol",validator.body(querySchemaSetUserRol) ,authenticateToken, updateRolUser);

// router.post("onboard-user/refresh",authenticateToken,onboardRefresh)







export default router;

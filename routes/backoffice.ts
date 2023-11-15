import express from "express";
import { authenticateToken } from "../middleware/auth";
import { getAllUsers, updateRolUser } from "../controllers/backoffice";
import { isAdmin } from "../middleware/isAdmin";
import Joivalidator from "express-joi-validation";
import { querySchemaSetUserRol } from "../middleware/validation";
const validator = Joivalidator.createValidator();


const router = express.Router();
// RECUERDA PONER LOS VALIDADORES DE JOI
router.post("/setUserRol",validator.body(querySchemaSetUserRol) ,isAdmin, updateRolUser);
router.get("/getUsers",isAdmin,getAllUsers);

// router.post("onboard-user/refresh",authenticateToken,onboardRefresh)







export default router;

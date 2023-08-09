import express from "express";
import {
  userRegisterController,
  userLoginController,
  userTokenValidate,
  recoverPasswordSendTokenController,
  changePasswordController,
} from "../controllers/user";
import Joivalidator from "express-joi-validation";
import { querySchemaChangePassword, querySchemaLogin, querySchemaRegistro, querySchemaSendToken, querySchemaValidate } from "../middleware/validation";
const validator = Joivalidator.createValidator();

const router = express.Router();

// router.get("/", authenticateToken, isAdmin, userController);

router.post(
  "/register",
  validator.body(querySchemaRegistro),
  userRegisterController
);

router.post("/recover-password-sendToken",validator.body(querySchemaSendToken), recoverPasswordSendTokenController);

router.post("/recover-password-changePassword",validator.body(querySchemaChangePassword), changePasswordController);

router.post("/login",validator.body(querySchemaLogin), userLoginController);

router.post("/validate",validator.body(querySchemaValidate), userTokenValidate);


export default router;

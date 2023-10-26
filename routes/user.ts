import express from "express";
import {
  userRegisterController,
  userLoginController,
  userTokenValidate,
  recoverPasswordSendTokenController,
  changePasswordController,
  userGoogleController,
  userRequestOrganizador,
  userEditProfile,
} from "../controllers/user";
import Joivalidator from "express-joi-validation";
import { querySchemaChangePassword, querySchemaLogin, querySchemaRegistro, querySchemaSendToken, querySchemaValidate } from "../middleware/validation";
import { authenticateToken } from "../middleware/auth";
const validator = Joivalidator.createValidator();

const router = express.Router();

// router.get("/", authenticateToken, isAdmin, userController);

router.post(
  "/register",
  userRegisterController
);

router.post("/recover-password-sendToken",validator.body(querySchemaSendToken), recoverPasswordSendTokenController);

router.post("/recover-password-changePassword",validator.body(querySchemaChangePassword), changePasswordController);

router.put("/login", userLoginController);

router.put("/validate",validator.body(querySchemaValidate), userTokenValidate);
router.post("/gooogleAuth", userGoogleController);
router.post("/requestOrganizador",authenticateToken, userRequestOrganizador);

router.put("/editProfile",authenticateToken, userEditProfile);


export default router;

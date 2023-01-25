import express from "express";
import {
  userRegisterController,
  userLoginController,
  userWalletController,
  recoverPasswordController,
  userTokenValidate,
} from "../controllers/user";
import Joivalidator from "express-joi-validation";
import { authenticateToken } from "../middleware/auth";
import { isAdmin } from "../middleware/isAdmin";
import { querySchemaRegistro } from "../middleware/validation";
const validator = Joivalidator.createValidator();

const router = express.Router();

// router.get("/", authenticateToken, isAdmin, userController);

router.post(
  "/register",
  validator.body(querySchemaRegistro),
  userRegisterController
);

router.post("/recover-password", recoverPasswordController);

router.post("/login", userLoginController);

router.post("/validate", userTokenValidate);

// router.post("/wallet", authenticateToken, userWalletController);

// router.post("/canTransfer", isAdmin, userCanTransferController);

// router.post("/canUse", isAdmin, userCanUseController);

export default router;

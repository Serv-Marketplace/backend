// src/routes/auth.routes.js
import express from "express";
import { AuthController } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/login/2fa", AuthController.verify2FA);

router.post("/2fa/setup", AuthController.setup2FA);
router.post("/2fa/enable", AuthController.enable2FA);

export default router;

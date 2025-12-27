// src/routes/auth.routes.js
import express from "express";
import { register, login, verify2FA, setup2FA, enable2FA } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/login/2fa", verify2FA);

router.post("/2fa/setup", setup2FA);
router.post("/2fa/enable", enable2FA);

export default router;

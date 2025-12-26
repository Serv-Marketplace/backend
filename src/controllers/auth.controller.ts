// src/controllers/auth.controller.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { UserModel } from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const AuthController = {
    // ================= REGISTER =================
    async register(req, res) {
        const { email, password } = req.body;

        const existing = await UserModel.findByEmail(email);
        if (existing) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userId = await UserModel.create({
            email,
            password: hashedPassword,
            twoFactorEnabled: false,
            createdAt: new Date(),
        });

        return res.status(201).json({
            message: "User registered",
            userId,
        });
    },

    // ================= LOGIN STEP 1 =================
    async login(req, res) {
        const { email, password } = req.body;

        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Jika 2FA aktif → minta OTP
        if (user.twoFactorEnabled) {
            return res.json({
                message: "2FA required",
                twoFactorRequired: true,
                userId: user._id,
            });
        }

        // Login normal (tanpa 2FA)
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.json({ token });
    },

    // ================= LOGIN STEP 2 (OTP) =================
    async verify2FA(req, res) {
        const { userId, token } = req.body;

        const user = await UserModel.findById(userId);
        if (!user || !user.twoFactorSecret) {
            return res.status(400).json({ message: "2FA not configured" });
        }

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: "base32",
            token,
            window: 1,
        });

        if (!verified) {
            return res.status(401).json({ message: "Invalid OTP" });
        }

        const jwtToken = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.json({ token: jwtToken });
    },

    // ================= SETUP 2FA =================
    async setup2FA(req, res) {
        const { userId } = req.body;

        const secret = speakeasy.generateSecret({
            name: "Serv Marketplace",
        });

        const qrCode = await QRCode.toDataURL(secret.otpauth_url);

        // Kirim secret sementara ke client
        return res.json({
            base32: secret.base32,
            qrCode,
        });
    },

    // ================= ENABLE 2FA =================
    async enable2FA(req, res) {
        const { userId, base32, token } = req.body;

        const verified = speakeasy.totp.verify({
            secret: base32,
            encoding: "base32",
            token,
            window: 1,
        });

        if (!verified) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        await UserModel.enable2FA(userId, base32);

        return res.json({ message: "2FA enabled successfully" });
    },
};

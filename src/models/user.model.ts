// src/models/user.model.js
import { connectDB } from "../config/db.js";
import { ObjectId } from "mongodb";

export async function findByEmail(email) {
    try {
        const db = await connectDB();
        return db.collection("users").findOne({ email });
    } catch (error) {
        throw new Error("Failed to fetch user by email: " + error.message);
    }
}

export async function findById(id) {
    try {
        const db = await connectDB();
        return db.collection("users").findOne({ _id: new ObjectId(id) });
    } catch (error) {
        throw new Error("Failed to fetch user by ID: " + error.message);
    }
}

export async function create(user) {
    try {
        const db = await connectDB();
        const result = await db.collection("users").insertOne(user);
        return result.insertedId;
    } catch (error) {
        throw new Error("Failed to create user: " + error.message);
    }
}

export async function enable2FAModel(userId, secret) {
    try {
        const db = await connectDB();
        return db.collection("users").updateOne(
            { _id: new ObjectId(userId) },
            {
                $set: {
                    twoFactorEnabled: true,
                    twoFactorSecret: secret,
                },
            }
        );
    } catch (error) {
        throw new Error("Failed to enable 2FA: " + error.message);
    }
}


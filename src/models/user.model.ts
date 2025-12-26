// src/models/user.model.js
import { connectDB } from "../config/db.js";
import { ObjectId } from "mongodb";

const COLLECTION = "users";
const db = await connectDB();

export const UserModel = {

    collection() {
        return db.database.collection(COLLECTION);
    },

    async findByEmail(email) {
        return this.collection().findOne({ email });
    },

    async findById(id) {
        return this.collection().findOne({ _id: new ObjectId(id) });
    },

    async create(user) {
        const result = await this.collection().insertOne(user);
        return result.insertedId;
    },

    async enable2FA(userId, secret) {
        return this.collection().updateOne(
            { _id: new ObjectId(userId) },
            {
                $set: {
                    twoFactorEnabled: true,
                    twoFactorSecret: secret,
                },
            }
        );
    },
};

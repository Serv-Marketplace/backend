import { connectDB } from "../config/db.js";

export async function getProducts(filter = {}) {
    try {
        const db = await connectDB();
        return db.collection("products").find(filter).toArray();
    } catch (error) {
        throw new Error("Failed to fetch products: " + error.message);
    }

}

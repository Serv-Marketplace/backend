import { getProducts } from "../models/product.model.js";

export async function listProducts(req, res, next) {
    try {
        const products = await getProducts();
        res.json(products);
    } catch (err) {
        next(err); // lempar ke error middleware
    }
}

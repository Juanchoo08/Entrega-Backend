import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import path from "path";

const router = Router();
const productManager = new ProductManager(path.join(process.cwd(), "products.json"));

router.get("/home", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
    res.render("realtimeProducts");
});

export default router;


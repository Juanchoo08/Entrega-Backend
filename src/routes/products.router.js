import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager("./products.json");

router.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});

router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    product ? res.json(product) : res.status(404).json({ error: "El producto no fue encontrado" });
});

router.post("/", async (req, res) => {
    const product = req.body;
    const newProduct = await productManager.addProduct(product);
    res.status(201).json(newProduct);
});

router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const update = req.body;
    const updatedProduct = await productManager.updateProduct(pid, update);
    updatedProduct ? res.json(updatedProduct) : res.status(404).json({ error: "El producto no fue encontrado" });
});

router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    const deleted = await productManager.deleteProduct(pid);
    deleted ? res.json({ message: "Producto eliminado" }) : res.status(404).json({ error: "El producto no fue encontrado" });
});

export default router;

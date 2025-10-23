import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import path from "path";

const router = Router();
const productManager = new ProductManager(path.join(process.cwd(), "products.json"));

function validateProductBody(body) {
    const required = ["title","description","code","price","status","stock","category","thumbnails"];
    for(const field of required){
    if(!(field in body)) return `Falta el campo requerido: ${field}`;
    }
    if (typeof body.title !== "string") return "title debe ser string";
    if (typeof body.description !== "string") return "description debe ser string";
    if (typeof body.code !== "string") return "code debe ser string";
    if (typeof body.price !== "number") return "price debe ser number";
    if (typeof body.status !== "boolean") return "status debe ser boolean";
    if (typeof body.stock !== "number") return "stock debe ser number";
    if (typeof body.category !== "string") return "category debe ser string";
    if (!Array.isArray(body.thumbnails)) return "thumbnails debe ser un array";
    return null;
}

router.get("/", async (req, res) => {
    const prods = await productManager.getProducts();
    res.json(prods);
});

router.get("/:pid", async (req, res) => {
    const product = await productManager.getProductById(req.params.pid);
    if(!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
});

router.post("/", async (req, res) => {
    const err = validateProductBody(req.body);
    if(err) return res.status(400).json({ error: err });

    try {
    const newProduct = await productManager.addProduct(req.body);
    const io = req.app.get("io");
    if(io){
        const all = await productManager.getProducts();
        io.emit("productsUpdated", all);
    }
    res.status(201).json(newProduct);
    } catch (e) {
    res.status(400).json({ error: e.message });
    }
});

router.put("/:pid", async (req, res) => {
    const updated = await productManager.updateProduct(req.params.pid, req.body);
    if(!updated) return res.status(404).json({ error: "Producto no encontrado" });
    const io = req.app.get("io");
    if(io){
    const all = await productManager.getProducts();
    io.emit("productsUpdated", all);
    }
    res.json(updated);
});

router.delete("/:pid", async (req, res) => {
    const deleted = await productManager.deleteProduct(req.params.pid);
    if(!deleted) return res.status(404).json({ error: "Producto no encontrado" });
    const io = req.app.get("io");
    if(io){
    const all = await productManager.getProducts();
    io.emit("productsUpdated", all);
    }
    res.json({ message: "Producto eliminado" });
});

export default router;
import { Router } from "express";
import { ProductService } from "../services/product.service.js";
import { CartService } from "../services/cart.service.js";

const router = Router();

router.get("/products", async (req, res) => {
    try {
    const { limit = 10, page = 1, sort } = req.query;
    const query = {};
    if(req.query.category) query.category = req.query.category;
    if(typeof req.query.available !== "undefined") query.available = req.query.available;

    const paginated = await ProductService.getPaginated({ limit, page, sort, query });

    res.render("products", {
        products: paginated.docs,
        totalPages: paginated.totalPages,
        prevPage: paginated.prevPage,
        nextPage: paginated.nextPage,
        page: paginated.page,
        hasPrevPage: paginated.hasPrevPage,
        hasNextPage: paginated.hasNextPage,
        prevLink: paginated.hasPrevPage ? `/products?page=${paginated.prevPage}&limit=${limit}` : null,
        nextLink: paginated.hasNextPage ? `/products?page=${paginated.nextPage}&limit=${limit}` : null
    });
    } catch (e) {
    console.error(e);
    res.status(500).send("Error interno");
    }
});

router.get("/products/:pid", async (req, res) => {
    try {
    const product = await ProductService.getById(req.params.pid);
    if(!product) return res.status(404).send("Producto no encontrado");
    res.render("productDetail", { product });
    } catch (e) {
    res.status(500).send("Error interno");
    }
});

router.get("/carts/:cid", async (req, res) => {
    try {
    const cart = await CartService.getById(req.params.cid);
    if(!cart) return res.status(404).send("Carrito no encontrado");
    res.render("cart", { cart });
    } catch (e) {
    res.status(500).send("Error interno");
    }
});

export default router;

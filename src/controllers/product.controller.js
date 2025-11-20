import { ProductService } from "../services/product.service.js";

export const ProductController = {
    async getProducts(req, res){
    try{
        const { limit = 10, page = 1, sort } = req.query;
      // collect category or available if provided
        const query = {};
        if(req.query.category) query.category = req.query.category;
        if(typeof req.query.available !== "undefined") query.available = req.query.available;

        const result = await ProductService.getPaginated({ limit, page, sort, query });

        const baseUrl = `${req.protocol}://${req.get("host")}${req.path}`;
        const makeLink = (p) => p ? `${baseUrl}?${new URLSearchParams({ ...req.query, page: p, limit }).toString()}` : null;

        return res.json({
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? makeLink(result.prevPage) : null,
        nextLink: result.hasNextPage ? makeLink(result.nextPage) : null
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ status: "error", message: e.message });
    }
    },

    async getById(req, res){
    try{
        const product = await ProductService.getById(req.params.pid);
        if(!product) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        return res.json({ status: "success", payload: product });
    } catch(e){
        return res.status(500).json({ status: "error", message: e.message });
    }
    },

    async create(req, res){
    try{
        const { title, code, price } = req.body;
        if(!title || !code || typeof price === "undefined") {
        return res.status(400).json({ status: "error", message: "Campos faltantes" });
        }
        const newProduct = await ProductService.create(req.body);

      // Emitir actualización a sockets si está disponible
        if(req.io) {
        const all = await ProductService.getPaginated({ limit: 1000, page: 1, query: {} });
        req.io.emit("productsUpdated", all.docs);
        }

        return res.status(201).json({ status: "success", payload: newProduct });
    } catch(e){
        return res.status(500).json({ status: "error", message: e.message });
    }
    },

    async update(req, res){
    try{
        const updated = await ProductService.update(req.params.pid, req.body);
        if(!updated) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        if(req.io){
        const all = await ProductService.getPaginated({ limit: 1000, page: 1, query: {} });
        req.io.emit("productsUpdated", all.docs);
        }
        return res.json({ status: "success", payload: updated });
    } catch(e){
        return res.status(500).json({ status: "error", message: e.message });
    }
    },

    async delete(req, res){
    try{
        const deleted = await ProductService.delete(req.params.pid);
        if(!deleted) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        if(req.io){
        const all = await ProductService.getPaginated({ limit: 1000, page: 1, query: {} });
        req.io.emit("productsUpdated", all.docs);
        }
        return res.json({ status: "success", message: "Producto eliminado" });
    } catch(e){
    return res.status(500).json({ status: "error", message: e.message });
    }
    }
};

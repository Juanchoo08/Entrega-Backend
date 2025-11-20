import { CartService } from "../services/cart.service.js";

export const CartController = {
    async create(req, res){
    try{
        const cart = await CartService.create();
        return res.status(201).json({ status: "success", payload: cart });
    } catch(e){
        return res.status(500).json({ status: "error", message: e.message });
    }
    },

    async getById(req, res){
    try{
        const cart = await CartService.getById(req.params.cid);
        if(!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        return res.json({ status: "success", payload: cart });
    } catch(e){
        return res.status(500).json({ status: "error", message: e.message });
    }
    },

    async addProduct(req, res){
    try{
        const cart = await CartService.addProduct(req.params.cid, req.params.pid);
        return res.json({ status: "success", payload: cart });
    } catch(e){
        return res.status(500).json({ status: "error", message: e.message });
    }
    },

    async removeProduct(req, res){
    try{
        const cart = await CartService.removeProduct(req.params.cid, req.params.pid);
        return res.json({ status: "success", payload: cart });
    } catch(e){
        return res.status(500).json({ status: "error", message: e.message });
    }
    },

    async updateCartProducts(req, res){
    try{
        const productsArray = req.body.products;
        const cart = await CartService.updateCartProducts(req.params.cid, productsArray);
        return res.json({ status: "success", payload: cart });
    } catch(e){
        return res.status(500).json({ status: "error", message: e.message });
    }
    },

    async updateProductQuantity(req, res){
    try{
        const { quantity } = req.body;
        if(typeof quantity === "undefined") return res.status(400).json({ status: "error", message: "Falta quantity" });
        const cart = await CartService.updateProductQuantity(req.params.cid, req.params.pid, Number(quantity));
        return res.json({ status: "success", payload: cart });
    } catch(e){
        return res.status(500).json({ status: "error", message: e.message });
    }
    },

    async clearCart(req, res){
    try{
        const cart = await CartService.clearCart(req.params.cid);
        return res.json({ status: "success", payload: cart });
    } catch(e){
        return res.status(500).json({ status: "error", message: e.message });
    }
    }
};

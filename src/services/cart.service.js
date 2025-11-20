import { CartModel } from "../models/cart.model.js";

export const CartService = {
    async create() {
    return CartModel.create({ products: [] });
    },

    async getById(cid) {
    return CartModel.findById(cid).populate("products.product").lean();
    },

    async addProduct(cid, pid) {
    const cart = await CartModel.findById(cid);
    if(!cart) throw new Error("Carrito no encontrado");
    const existing = cart.products.find(p => p.product.toString() === pid);
    if(existing) existing.quantity += 1;
    else cart.products.push({ product: pid, quantity: 1 });
    await cart.save();
    return cart;
    },

    async removeProduct(cid, pid) {
    const cart = await CartModel.findById(cid);
    if(!cart) throw new Error("Carrito no encontrado");
    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    return cart;
    },

    async updateCartProducts(cid, productsArray) {
    const cart = await CartModel.findById(cid);
    if(!cart) throw new Error("Carrito no encontrado");
    cart.products = productsArray.map(p => ({ product: p.product, quantity: p.quantity }));
    await cart.save();
    return cart;
    },

    async updateProductQuantity(cid, pid, quantity) {
    const cart = await CartModel.findById(cid);
    if(!cart) throw new Error("Carrito no encontrado");
    const item = cart.products.find(p => p.product.toString() === pid);
    if(!item) throw new Error("Producto no encontrado en carrito");
    item.quantity = quantity;
    await cart.save();
    return cart;
    },

    async clearCart(cid) {
    const cart = await CartModel.findById(cid);
    if(!cart) throw new Error("Carrito no encontrado");
    cart.products = [];
    await cart.save();
    return cart;
    }
};

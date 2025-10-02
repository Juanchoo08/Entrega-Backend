import fs from "fs/promises";

class CartManager {
    constructor(path) {
    this.path = path;
    }

    async _readFile() {
    try {
        const data = await fs.readFile(this.path, "utf-8");
        return JSON.parse(data);
    } catch {
        return [];
    }
    }

    async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
    }

    async createCart() {
    const carts = await this._readFile();
    const newCart = {
        id: carts.length ? carts[carts.length - 1].id + 1 : 1,
        products: []
    };
    carts.push(newCart);
    await this._writeFile(carts);
    return newCart;
    }

    async getCartById(id) {
    const carts = await this._readFile();
    return carts.find(c => c.id == id);
    }

    async addProductToCart(cid, pid) {
    const carts = await this._readFile();
    const cartIndex = carts.findIndex(c => c.id == cid);
    if (cartIndex === -1) return null;

    const cart = carts[cartIndex];
    const product = cart.products.find(p => p.product == pid);

    if (product) {
        product.quantity++;
    } else {
        cart.products.push({ product: pid, quantity: 1 });
    }

    carts[cartIndex] = cart;
    await this._writeFile(carts);
    return cart;
    }
}

export default CartManager;
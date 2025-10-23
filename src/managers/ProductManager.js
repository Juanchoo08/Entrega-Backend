import fs from "fs/promises";

class ProductManager {
    constructor(path) {
    this.path = path;
    }

    async _readFile() {
    try {
        const data = await fs.readFile(this.path, "utf-8");
        return JSON.parse(data || "[]");
    } catch {
        return [];
    }
    }

    async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
    }

    async getProducts() {
    return await this._readFile();
    }

    async getProductById(id) {
    const products = await this._readFile();
    return products.find(p => String(p.id) === String(id));
    }

    async addProduct(product) {
    const products = await this._readFile();

    if (products.some(p => p.code === product.code)) {
        throw new Error("El campo 'code' ya existe para otro producto");
    }

    const maxId = products.reduce((max, p) => (p.id > max ? p.id : max), 0);
    const newProduct = {
        id: maxId + 1,
        ...product,
    };
    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
    }

    async updateProduct(id, update) {
    const products = await this._readFile();
    const idx = products.findIndex(p => String(p.id) === String(id));
    if (idx === -1) return null;

    const preservedId = products[idx].id;
    products[idx] = { ...products[idx], ...update, id: preservedId };
    await this._writeFile(products);
    return products[idx];
    }

    async deleteProduct(id) {
    const products = await this._readFile();
    const idx = products.findIndex(p => String(p.id) === String(id));
    if (idx === -1) return null;
    products.splice(idx, 1);
    await this._writeFile(products);
    return true;
    }
}

export default ProductManager;
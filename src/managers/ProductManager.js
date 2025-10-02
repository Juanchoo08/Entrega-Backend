import fs from "fs/promises";

class ProductManager {
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

    async getProducts() {
    return await this._readFile();
    }

    async getProductById(id) {
    const products = await this._readFile();
    return products.find(p => p.id == id);
    }

    async addProduct(product) {
    const products = await this._readFile();
    const newProduct = {
        id: products.length ? products[products.length - 1].id + 1 : 1,
        ...product,
    };
    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
    }

    async updateProduct(id, update) {
    const products = await this._readFile();
    const index = products.findIndex(p => p.id == id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...update, id: products[index].id };
    await this._writeFile(products);
    return products[index];
    }

    async deleteProduct(id) {
    const products = await this._readFile();
    const index = products.findIndex(p => p.id == id);
    if (index === -1) return null;
    products.splice(index, 1);
    await this._writeFile(products);
    return true;
    }
}

export default ProductManager;

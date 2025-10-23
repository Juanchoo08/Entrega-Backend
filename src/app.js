import express from "express";
import http from "http";
import { Server as IOServer } from "socket.io";
import { engine } from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/ProductManager.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new IOServer(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));
app.set("io", io);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const productManager = new ProductManager(path.join(process.cwd(), "products.json"));

io.on("connection", async (socket) => {
    console.log("Cliente conectado:", socket.id);
    const products = await productManager.getProducts();
    socket.emit("productsUpdated", products);

    socket.on("newProduct", async (productData, cb) => {
    try {
        const newProduct = await productManager.addProduct(productData);
        const all = await productManager.getProducts();
        io.emit("productsUpdated", all);
        cb && cb({ status: "ok", product: newProduct });
    } catch (err) {
        cb && cb({ status: "error", message: err.message });
    }
    });

    socket.on("deleteProduct", async (pid, cb) => {
    try {
        const deleted = await productManager.deleteProduct(pid);
        if (!deleted) throw new Error("Producto no encontrado");
        const all = await productManager.getProducts();
        io.emit("productsUpdated", all);
        cb && cb({ status: "ok" });
    } catch (err) {
        cb && cb({ status: "error", message: err.message });
    }
    });
});

const PORT = 8080;
server.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));

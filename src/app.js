import express from "express";
import http from "http";
import { Server as IOServer } from "socket.io";
import path from "path";
import { engine } from "express-handlebars";
import connectDB from "./config/db.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import dotenv from "dotenv";
dotenv.config();

await connectDB();

const app = express();
const server = http.createServer(app);
const io = new IOServer(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public")));

app.engine("handlebars", engine({ defaultLayout: "main", layoutsDir: path.join(process.cwd(), "src/views/layouts") }));
app.set("view engine", "handlebars");
app.set("views", path.join(process.cwd(), "src/views"));

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

io.on("connection", (socket) => {
    console.log("Cliente socket conectado:", socket.id);
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server escuchando en puerto ${PORT}`));

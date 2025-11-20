import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";

const router = Router();

router.get("/", ProductController.getProducts);
router.get("/:pid", ProductController.getById);
router.post("/", ProductController.create);
router.put("/:pid", ProductController.update);
router.delete("/:pid", ProductController.delete);

export default router;
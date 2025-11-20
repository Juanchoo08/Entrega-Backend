import { Router } from "express";
import { CartController } from "../controllers/cart.controller.js";

const router = Router();

router.post("/", CartController.create);
router.get("/:cid", CartController.getById);
router.post("/:cid/product/:pid", CartController.addProduct);
router.delete("/:cid/products/:pid", CartController.removeProduct);
router.put("/:cid", CartController.updateCartProducts);
router.put("/:cid/products/:pid", CartController.updateProductQuantity);
router.delete("/:cid", CartController.clearCart);

export default router;
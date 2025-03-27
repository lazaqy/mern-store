import {Router} from "express";
import auth from "../middlewares/auth.js";
import { AddToCartItemController, deleteCartItemQtyController, getCartItemController, updateCartItemController } from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.post("/add", auth, AddToCartItemController);
cartRouter.get("/get", auth, getCartItemController);
cartRouter.put("/update-qty", auth, updateCartItemController);
cartRouter.delete("/delete-cart-item", auth, deleteCartItemQtyController);

export default cartRouter
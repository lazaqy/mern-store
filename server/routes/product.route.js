import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
  AddProductController,
  deleteProductController,
  getProductByCategoriesController,
  getProductByCategoriesAndSubController,
  getProductController,
  updateProductController,
  getProductDetailsController,
  searchProductController,
} from "../controllers/product.controller.js";
import isAdmin from "../middlewares/Admin.js";

const productRouter = Router();

productRouter.post("/add", auth, isAdmin, AddProductController);
productRouter.post("/get", getProductController);
productRouter.post("/search", searchProductController);
productRouter.post("/get-product-by-category", getProductByCategoriesController);
productRouter.post("/get-product-by-category-and-subcategory", getProductByCategoriesAndSubController);
productRouter.post("/get-product-details", getProductDetailsController);
productRouter.put("/update", auth, isAdmin, updateProductController);
productRouter.delete("/delete", auth, isAdmin, deleteProductController);

export default productRouter;

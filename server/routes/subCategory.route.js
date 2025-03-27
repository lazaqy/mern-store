import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
  AddSubCategoryController,
  deleteSubCategoryController,
  getSubCategoryController,
  updateSubCategoryController,
} from "../controllers/subCategory.controller.js";

const subCategoryRouter = Router();

subCategoryRouter.post("/add", auth, AddSubCategoryController);
subCategoryRouter.get("/get", getSubCategoryController);
subCategoryRouter.put("/update", auth, updateSubCategoryController);
subCategoryRouter.delete("/delete", auth, deleteSubCategoryController);

export default subCategoryRouter;

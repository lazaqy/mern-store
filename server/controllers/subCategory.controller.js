import SubCategoryModel from "../models/subCategory.model.js";
import ProductModel from "../models/product.model.js";

export const AddSubCategoryController = async (req, res) => {
  try {
    const { name, image, category } = req.body;
    if (!name || !image || !category[0]) {
      return res.status(400).json({
        message: "Please fill in all fields",
        error: true,
        success: false,
      });
    }
    const addSubCategory = new SubCategoryModel({
      name,
      image,
      category,
    });
    const saveSubCategory = await addSubCategory.save();

    if (!saveSubCategory) {
      return res.status(400).json({
        message: "Failed to add category",
        error: true,
        success: false,
      });
    }

    return res.status(201).json({
      message: "Sub Category added successfully",
      data: saveSubCategory,
      error: false,
      success: true,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getSubCategoryController = async (req, res) => {
  try {
    const data = await SubCategoryModel.find().sort({ name: 1 }).populate('category');

    return res.json({
      data: data,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const updateSubCategoryController = async (req, res) => {
  try {
    const { _id, name, image, category } = req.body;
    const checkId = await SubCategoryModel.findById(_id);
    if (!checkId) {
      return res.status(400).json({
      message: "Sub Category not found",
      success: false,
      error: true,
      })
    }
    const update = await SubCategoryModel.findByIdAndUpdate(
      {
        _id: _id,
      },
      {
        name,
        image,
        category,
      }
    );
    return res.json({
      message: "Updated sub-category",
      success: true,
      error: false,
      data: update,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const deleteSubCategoryController = async (req, res) => {
  try {
    const { _id } = req.body;

    const checkProduct = await ProductModel.find({
      category: {
        $in: [_id],
      },
    }).countDocuments();

    if (checkProduct > 0) {
      return res.status(400).json({
        message: "Sub Category is already use, cann't delete",
        success: false,
        error: true,
      });
    }

    const deleteSubCategory = await SubCategoryModel.deleteOne({ _id: _id });

    return res.json({
      message: "Delete sub-category successfully",
      success: true,
      error: false,
      data: deleteSubCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

import CategoryModel from "../models/category.model.js";
import SubCategoryModel from "../models/subCategory.model.js";
import ProductModel from "../models/product.model.js";

export const AddProductController = async (req, res) => {
  try {
    const {
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    } = req.body;

    if (
      !name ||
      !image[0] ||
      !category[0] ||
      !subCategory[0] ||
      !unit ||
      !stock ||
      !price ||
      !discount ||
      !description
    ) {
      return res.status(400).json({
        message: "Please fill in all fields",
        error: true,
        success: false,
      });
    }
    const addProduct = new ProductModel({
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    });

    const saveProduct = await addProduct.save();

    if (!saveProduct) {
      return res.status(400).json({
        message: "Failed to add Product",
        error: true,
        success: false,
      });
    }

    return res.status(201).json({
      message: "Product added successfully",
      data: saveProduct,
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

export const getProductController = async (req, res) => {
  try {
    let { page, limit, search } = req.body;

    if (!page) page = 1;
    if (!limit) limit = 10;

    const query = search
      ? {
          name: { $regex: search, $options: "i" },
          description: { $regex: search, $options: "i" },
        }
      : {};

    const [data, totalCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("category")
        .populate("subCategory"),
      ProductModel.countDocuments(query),
    ]);

    return res.json({
      message: "Products fetched successfully",
      data: data,
      totalCount: totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
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

export const updateProductController = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({
        message: "Provide product id",
        success: false,
        error: true,
      });
    }
    const update = await ProductModel.updateOne(
      {
        _id: _id,
      },
      {
        ...req.body,
      }
    );
    return res.json({
      message: "Updated Product Successfuly",
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

export const deleteProductController = async (req, res) => {
  try {
    const { _id } = req.body;

    const deleteProduct = await ProductModel.deleteOne({ _id: _id });

    return res.json({
      message: "Delete product successfully",
      success: true,
      error: false,
      data: deleteProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const getProductByCategoriesController = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id)
      return res.status(400).json({
        message: "Please provide category id",
        success: false,
        error: true,
      });

    const product = await ProductModel.find({
      category: { $in: id },
    }).limit(15);

    return res.json({
      message: "Category Product List",
      success: true,
      error: false,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error || error.message,
      success: false,
      erorr: true,
    });
  }
};

export const getProductByCategoriesAndSubController = async (req, res) => {
  try {
    const { category, subCategory, page, limit } = req.body;

    if (!category || !subCategory) {
      return res.status(400).json({
        message: "Please fill in all fields",
        error: true,
        success: false,
      });
    }

    if (!page) page = 1;
    if (!limit) limit = 10;

    const [product, count] = await Promise.all([
      ProductModel.find({
        category: { $in: category },
        subCategory: { $in: subCategory },
      })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      ProductModel.countDocuments(),
    ]);

    return res.json({
      message: "Products fetched successfully",
      data: product,
      totalCount: count,
      page: page,
      limit: limit,
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

export const getProductDetailsController = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await ProductModel.findById(id).populate("category");
    return res.json({
      message: "Product details fetched successfully",
      success: true,
      error: false,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const searchProductController = async (req, res) => {
  try {
    let { search, page, limit } = req.body;
    if (!page) page = 1;
    if (!limit) limit = 10;
    const query = search
      ? {
          $text: {
            $search: search,
          },
        }
      : {};
    const [product, count] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("category")
        .populate("subCategory"),
      ProductModel.countDocuments(query),
    ]);
    return res.json({
      message: "Product details fetched successfully",
      success: true,
      error: false,
      data: product,
      count: count,
      pageCount: Math.ceil(count / limit),
      limit: limit,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

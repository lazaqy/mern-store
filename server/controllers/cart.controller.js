import CartProductModel from "../models/cart.model.js";
import userModel from "../models/user.model.js";

export const AddToCartItemController = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        success: false,
        error: true,
      });
    }

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
        success: false,
        error: true,
      });
    }

    const checkItem = await CartProductModel.findOne({
      productId,
      userId,
    });

    if (checkItem) {
      return res.status(400).json({
        message: "Item already in cart",
        success: false,
        error: true,
      });
    }

    const cartItem = new CartProductModel({
      productId,
      userId,
    });

    const save = await cartItem.save();

    if (!save) {
      return res.status(400).json({
        message: "Failed to add item to cart",
        success: false,
        error: true,
      });
    }

    const updateUserCart = await userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { shopping_cart: cartItem._id } },
      { new: true }
    );

    return res.status(201).json({
      message: "Item added to cart successfully",
      success: true,
      error: false,
      data: save,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const getCartItemController = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        success: false,
        error: true,
      });
    }

    const cartItems = await CartProductModel.find({ userId }).populate(
      "productId"
    );

    return res.status(200).json({
      message: "Cart items fetched successfully",
      success: true,
      error: false,
      data: cartItems,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const updateCartItemController = async (req, res) => {
  try {
    const user_id = req.userId;
    const { _id, qty } = req.body;

    if (!_id || !qty) {
      return res.status(400).json({
        message: "Please fill in all fields",
      });
    }

    const updateCart = await CartProductModel.findOneAndUpdate(
      {
        _id: _id,
      },
      {
        quantity: qty,
      }
    );

    return res.status(200).json({
      message: "Cart item updated successfully",
      success: true,
      error: false,
      data: updateCart,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const deleteCartItemQtyController = async (req, res) => {
  try {
    const userId = req.userId;
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        message: "Please fill in all fields",
        error: true,
        success: false,
      });
    }

    const deleteCart = await CartProductModel.findOneAndDelete({
      _id: _id,
    });

    return res.status(200).json({
      message: "Item remove from cart",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

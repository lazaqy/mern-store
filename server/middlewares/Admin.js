import userModel from "../models/user.model.js";

const isAdmin = async (req, res, next) => {
  const userId = req.userId;

  const user = await userModel.findById(userId);

  if (user.role !== "ADMIN") {
    return res.status(401).json({ message: "Access Denied !!" });
  }

  next();
};

export default isAdmin;
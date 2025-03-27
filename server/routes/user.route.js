import { Router } from "express";
import {
  forgotPasswordController,
  loginUserController,
  logoutUserController,
  refreshTokenController,
  registerUserController,
  resetPasswordController,
  getUserDetailsController,
  updateUserController,
  uploadAvatarController,
  verifyEmailController,
  verifyOtpController,
} from "../controllers/user.controller.js";
import auth from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.get("/verify-email", verifyEmailController);
userRouter.post("/login", loginUserController);
userRouter.post("/logout", auth, logoutUserController);
userRouter.put(
  "/upload-avatar",
  auth,
  upload.single("avatar"),
  uploadAvatarController
);
userRouter.put("/update-user", auth, updateUserController);
userRouter.put("/forgot-password", forgotPasswordController);
userRouter.put("/verify-password-otp", verifyOtpController);
userRouter.put("/reset-password", resetPasswordController);
userRouter.post("/refresh-token", refreshTokenController);
userRouter.get("/user-details", auth, getUserDetailsController);

export default userRouter;

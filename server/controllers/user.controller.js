import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import sendEmail from "../config/sendEmail.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import uploadImageToCloudinary from "../utils/uploadImage.js";
import generateOtp from "../utils/generateOtp.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/env.js";

export async function registerUserController(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
        error: true,
      });
    }
    const user = await UserModel.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User alredy exists",
        success: false,
        error: true,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new UserModel({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();

    const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?token=${savedUser?._id}`;

    const verifiEmail = await sendEmail({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Verify Email From MyStore",
      html: verifyEmailTemplate({
        name,
        url: VerifyEmailUrl,
      }),
    });

    res.status(201).json({
      message: "User registered successfully",
      success: true,
      error: false,
      data: savedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
}

export async function verifyEmailController(req, res) {
  try {
    const { token } = req.query;
    const user = await UserModel.findById(token);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }
    user.veriry_email = true;
    await user.save();
    res.status(200).json({
      message: "Email verified successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
}

export async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
        error: true,
      });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
        error: true,
      });
    }

    if (!user.verify_email) {
      return res.status(400).json({
        message: "Please verify your email",
        success: false,
        error: true,
      });
    }

    if (user.status !== "Active") {
      return res.status(400).json({
        message: "Your account is Inactive",
        success: false,
        error: true,
      });
    }

    const updateUser = await UserModel.findByIdAndUpdate(user._id, {
      $set: {
        last_login_date: new Date().toISOString(),
      },
    });

    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    const cookieOptions = envConfig[process.env.NODE_ENV];

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.status(200).json({
      message: "Login successful",
      success: true,
      error: false,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
}

export async function logoutUserController(req, res) {
  try {
    const userId = req.userId;

    const cookieOptions = envConfig[process.env.NODE_ENV];

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    const removeRefreshTokenUser = await UserModel.findByIdAndUpdate(userId, {
      refresh_token: "",
    });

    res.status(200).json({
      message: "Logout successful",
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
}

export async function uploadAvatarController(req, res) {
  try {
    const { userId } = req;
    const avatar = await uploadImageToCloudinary(req.file);
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { avatar: avatar.url },
      { new: true }
    );
    res.status(200).json({
      message: "Avatar uploaded successfully",
      success: true,
      error: false,
      data: { userId, avatar: avatar.url },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
}

export async function updateUserController(req, res) {
  try {
    const userId = req.userId;
    const { name, email, mobile, password } = req.body;

    let hashedPassword = "";
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      hashedPassword = await bcryptjs.hash(password, salt);
      req.body.password = hashedPassword;
    }
    const updateUser = await UserModel.updateOne(
      { _id: userId },
      {
        ...(name && { name: name }),
        ...(email && { email: email }),
        ...(mobile && { mobile: mobile }),
        ...(password && { password: password }),
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Updated successfully",
      success: true,
      error: false,
      data: updateUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function forgotPasswordController(req, res) {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Email not found",
        success: false,
        error: true,
      });
    }
    const otp = generateOtp();
    const expiresIn = new Date() + 5 * 60 * 1000; // 5 minutes in milliseconds

    const updateUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        $set: {
          forgot_password_otp: otp,
          forgot_password_expire: new Date(expiresIn).toISOString(),
        },
      },
      { new: true }
    );

    const message = forgotPasswordTemplate(user.name, otp);
    await sendEmail({
      from: "Lazaqy <lazaqy@gmail.com>",
      to: email,
      subject: "Reset Password",
      html: message,
    });
    return res.status(200).json({
      message: "Email sent successfully",
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
}

export async function verifyOtpController(req, res) {
  try {
    const { email, otp } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Email not found",
        success: false,
        error: true,
      });
    }
    if (user.forgot_password_otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        success: false,
        error: true,
      });
    }
    const currentTime = new Date().toISOString();
    if (user.forgot_password_expire < currentTime) {
      return res.status(400).json({
        message: "OTP expired",
        success: false,
        error: true,
      });
    }

    const updateUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        $unset: {
          forgot_password_otp: "",
          forgot_password_expire: "",
        },
      },
      { new: true }
    );
    return res.status(200).json({
      message: "OTP verified successfully",
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
}

export async function resetPasswordController(req, res) {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
        error: true,
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
        success: false,
        error: true,
      });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Email not found",
        success: false,
        error: true,
      });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);
    const updateUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        password: hashedPassword,
      },
      { new: true }
    );
    return res.status(200).json({
      message: "Password reset successfully",
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
}

export async function refreshTokenController(req, res) {
  try {
    const refreshToken =
      req.cookies.refreshToken || req.headers?.authorization?.split(" ")[1];
    if (!refreshToken) {
      return res.status(401).json({
        message: "Invalid Token",
        success: false,
        error: true,
      });
    }
    const isMatch = await jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN
    );
    if (!isMatch) {
      return res.status(401).json({
        message: "Token is expired",
        success: false,
        error: true,
      });
    }
    const userId = isMatch.id;
    const newAccessToken = await generateAccessToken(userId);

    const cookieOptions = envConfig[process.env.NODE_ENV];

    res.cookie("accessToken", newAccessToken, cookieOptions);

    return res.status(200).json({
      message: "Access token updated successfully",
      success: true,
      error: false,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function getUserDetailsController(req, res) {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId).select(
      "-password -refresh_token"
    );
    return res.status(200).json({
      message: "User details fetched successfully",
      success: true,
      error: false,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

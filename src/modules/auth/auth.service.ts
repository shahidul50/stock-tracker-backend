import jwt, { type SignOptions } from "jsonwebtoken";

import config from "../../lib/config";
import User from "../../models/User.model";
import { AppError } from "../../utils/AppError";

export interface LoginPayload {
  email: string;
  password: string;
}

const loginUser = async ({ email, password }: LoginPayload) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
  }

  const token = jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    config.jwt_secret as string,
    { expiresIn: (config.jwt_expires_in || "7d") as string } as SignOptions,
  );

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const getUserById = async (userId: string) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new AppError("User not found.", 401, "USER_NOT_FOUND");
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const authService = {
  loginUser,
  getUserById,
};

import type { NextFunction, Request, Response } from "express";

import config from "../../lib/config";
import { AppError } from "../../utils/AppError";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { loginSchema } from "./auth.validation";
import { authService } from "./auth.service";
import { AuthUser } from "../../middlewares/auth";

const login = asyncHandler(async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0]?.message || "Validation failed";
    throw new AppError(errorMessage, 400, "VALIDATION_ERROR");
  }

  const result = await authService.loginUser(parsed.data);

  res.cookie("token", result.token, {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return sendResponse(
    res,
    200,
    {
      user: result.user,
      token: result.token,
    },
    "Login successful",
  );
});

const getMe = asyncHandler(
  async (req: Request & { user?: AuthUser }, res: Response) => {
    if (!req.user) {
      throw new AppError("User not authenticated.", 401, "UNAUTHORIZED");
    }

    const user = await authService.getUserById(req.user.id);

    return sendResponse(res, 200, { user });
  },
);

const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("token");

  return sendResponse(res, 200, null, "Logged out successfully");
});

export const authController = {
  login,
  getMe,
  logout,
};

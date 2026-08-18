import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import config from "../lib/config";
import User from "../models/User.model";
import { AppError } from "../utils/AppError";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}


const getTokenFromRequest = (req: Request): string | null => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1] ?? null;
  }

  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const cookiePair = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("token="));

  if (!cookiePair) return null;

  return decodeURIComponent(cookiePair.split("=")[1] ?? "");
};

export const protect = async (req: Request & { user?: AuthUser }, res: Response, next: NextFunction) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      throw new AppError("Unauthorized access. Please login first.", 401, "UNAUTHORIZED");
    }

    const decoded = jwt.verify(token, config.jwt_secret as string) as {
      id: string;
      email: string;
      role: string;
    };

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new AppError("User not found.", 401, "USER_NOT_FOUND");
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    next(new AppError("Unauthorized access. Please login first.", 401, "UNAUTHORIZED"));
  }
};

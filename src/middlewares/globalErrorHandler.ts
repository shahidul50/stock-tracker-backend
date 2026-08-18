import type { NextFunction, Request, Response } from "express";

import config from "../lib/config";
import { AppError } from "../utils/AppError";

const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  let statusCode = err.statusCode ?? 500;
  let message = err.message ?? "An unexpected error occurred.";
  let errorCode = err.code ?? "INTERNAL_SERVER_ERROR";
  let errorDetails = err;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorCode = err.code;
  } else if (err?.name === "ValidationError") {
    statusCode = 400;
    errorCode = "VALIDATION_ERROR";
    message = err.message;
  } else if (err?.name === "CastError") {
    statusCode = 400;
    errorCode = "INVALID_ID";
    message = "Invalid ID format.";
  } else if (err?.code === 11000) {
    statusCode = 409;
    errorCode = "DUPLICATE_ENTRY";
    message = "Duplicate value detected. Please use a unique value.";
  } else if (err.body?.code === "FAILED_TO_GET_SESSION" || err?.code === "ECONNREFUSED") {
    statusCode = 503;
    errorCode = "DATABASE_CONNECTION_ERROR";
    message = "Could not connect to the database. Please ensure your database server is running.";
  }

  const isDev = config.node_env === "development";

  res.status(statusCode).json({
    success: false,
    code: errorCode,
    message,
    error: isDev ? errorDetails : {},
    stack: isDev ? err.stack : undefined,
  });
};

export default errorHandler;
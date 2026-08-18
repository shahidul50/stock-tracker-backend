import type { Response } from "express";

interface SuccessResponse<T> {
  success: true;
  message?: string;
  data?: T;
}

interface ErrorResponse {
  success: false;
  message: string;
  code?: string;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  data: T | null = null,
  message?: string,
): Response => {
  const response: SuccessResponse<T> = {
    success: true,
    ...(message && { message }),
    ...(data !== null && { data }),
  };

  return res.status(statusCode).json(response);
};

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  code?: string,
): Response => {
  const response: ErrorResponse = {
    success: false,
    message,
    ...(code && { code }),
  };

  return res.status(statusCode).json(response);
};

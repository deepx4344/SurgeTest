import { ApiResponseinput, ServiceError } from "../types/index.js";
import { createAPIResponse } from "../utils/index.js";
import { Request, Response, NextFunction } from "express";
import logger from "./logger.js";

const errormiddleWare = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: number = 500;
  let message: string = "An Error Occured";

  if (err instanceof ServiceError) {
    statusCode = err.statusCode;
    switch (statusCode) {
      case 400:
        message = err.message || "Bad Request";
        break;
      case 401:
        message = err.message || "Unauthorized";
        break;
      case 403:
        message = err.message || "Unauthorized";
        break;
      case 404:
        message = err.message || "Not Found";
        break;
      case 409:
        message = err.message || "Conflict";
        break;
      case 502:
        message = err.message || "Bad Gateway";
        break;
      default:
        message = err.message || message;
        break;
    }
  } else {
    if (err && typeof err === "object" && "statusCode" in (err as any)) {
      const anyErr = err as any;
      statusCode = anyErr.statusCode || statusCode;
      message = anyErr.message || message;
      logger.error("Handled error object with statusCode", anyErr);
    } else {
      logger.error(err);
    }
  }

  const dataToSend: ApiResponseinput = {
    success: false,
    message: message,
  };
  return res.status(statusCode).json(createAPIResponse(dataToSend));
};

export default errormiddleWare;

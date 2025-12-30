import { Response, Request, NextFunction } from "express";
import { createAPIResponse } from "../utils/index.js";
import { ApiResponseinput } from "../types/index.js";

export const validateSchema = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const details = error.details.map((d: any) => d.message);
      const dataTosend: ApiResponseinput = {
        success: false,
        message: "Invalid data",
        errors: details,
      };
      return res.status(400).json(createAPIResponse(dataTosend));
    }
    return next();
  };
};

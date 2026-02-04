import { ApiResponseinput } from "../types/index.js";
import { ServiceError } from "./errors.js";

export function createServiceError(
  message: string,
  statusCode: number,
  code?: string,
  details?: any
): ServiceError {
  return new ServiceError(message, statusCode, code, details);
}

export function createAPIResponse(input: ApiResponseinput) {
  return input;
}

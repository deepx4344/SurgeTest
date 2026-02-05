import { ApiResponseinput } from "../types/index.js";
import { ServiceError } from "./errors.js";

export function createServiceError(
  message: string,
  statusCode: number,
  code?: string,
  details?: any,
): ServiceError {
  return new ServiceError(message, statusCode, code, details);
}

// This is a placeholder for future transformation logic. Timestamp added for now.
export function createAPIResponse(input: ApiResponseinput) {
  return {
    ...input,
    timestamp: new Date().toISOString(),
  };
}

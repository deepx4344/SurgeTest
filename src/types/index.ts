export interface User {
  id: string;
  registered: boolean;
  email?: string;
}
export class ServiceError extends Error {
  statusCode: number;
  code?: string;
  details?: any;
  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    details?: any
  ) {
    super(message);
    this.name = "ServiceError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}
export interface ServiceErrorInput {
  message: string;
  statusCode: number;
  code?: string;
  details?: any;
}

export interface ApiResponseinput {
  success: boolean;
  message: string;
  token?: string;
  data?: object;
  datas?: Record<string, string[]> | object[];
  error?: string;
  errors?: Record<string, string[]>;
}

export interface JWTPayload {
  id: string;
  email: string;
  paid: boolean;
}
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

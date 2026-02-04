export interface User {
  _id: string;
  email: string;
  password?: string;
  verified: boolean;
  paid: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TestResults {
  totalRequests: number;
  successCount: number;
  failCount: number;
  errors: string[];
}

export interface Test {
  _id: string;
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Map<string, string>;
  body?: any;
  concurrency: number;
  duration: number;
  status: "pending" | "running" | "completed" | "failed";
  results?: TestResults;
  createdAt?: Date;
  updatedAt?: Date;
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
  tokens?: Tokens;
  data?: object | string;
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
export interface configs {
  paid: boolean;
  concurent: number;
  totalPerTest: number;
  testPerHour: number;
}

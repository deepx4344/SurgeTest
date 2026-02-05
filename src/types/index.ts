import { InferSchemaType } from "mongoose";
import { usersSchema } from "../models/users.js";
import { testSchema } from "../models/test.js";

export type User =InferSchemaType<typeof usersSchema>

export interface TestResults {
  totalRequests: number;
  successCount: number;
  failCount: number;
  errors: string[];
}

export type Test = InferSchemaType<typeof testSchema>

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
  user?:User;
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
  concurrent: number;
  totalPerTest: number;
  testPerHour: number;
}

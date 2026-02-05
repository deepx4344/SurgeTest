import Joi from "joi";
import { HttpMethods } from "../types/index.js";

export const loadSchema = Joi.object({
  url: Joi.string().required(),
  method: Joi.string()
    .valid(...Object.values(HttpMethods))
    .required(),
  name: Joi.string().max(30).allow(""),
  description: Joi.string().max(255).allow(""),
  headers: Joi.any(),
  body: Joi.any(),
  concurrency: Joi.number().min(1).default(10),
  duration: Joi.number().min(1).default(30),
}).unknown(false);

import mongoose from "mongoose";
import { HttpMethods, TestStatus } from "../types/index.js";

export const testSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      enum: Object.values(HttpMethods),
      required: true,
    },
    headers: {
      type: Map,
      of: String,
    },
    body: {
      type: mongoose.Schema.Types.Mixed,
    },
    concurrency: {
      type: Number,
      required: true,
      default: 10,
    },
    duration: {
      type: Number,
      required: true,
      default: 30,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(TestStatus),
      default: TestStatus.pending,
    },
    results: {
      totalRequests: { type: Number, default: 0 },
      successCount: { type: Number, default: 0 },
      failCount: { type: Number, default: 0 },
      errors: { type: [String], default: [] },
    },
  },
  {
    timestamps: true,
  },
);

testSchema.index({ status: 1 });
const Tests = mongoose.model("Test", testSchema);
export default Tests;

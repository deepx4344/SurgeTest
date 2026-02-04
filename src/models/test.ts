import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
        },
        method: {
            type: String,
            enum: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            default: "GET",
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
            required: true, // in seconds
            default: 30,
        },
        status: {
            type: String,
            enum: ["pending", "running", "completed", "failed"],
            default: "pending",
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
    }
);

const Test = mongoose.model("Test", testSchema);
export default Test;

import mongoose, { Schema } from "mongoose";

const interviewModel = new Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        interviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        interviewee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: [
                "open",
                "pending",
                "accepted",
                "in_progress",
                "completed",
                "cancelled",
            ],
            default: "open",
        },
        price: { type: Number, required: true, min: 0 },
        currency: { type: String, required: true, trim: true },
        jobType: { type: String, required: true, trim: true },
        experienceLevel: { type: String, required: true, trim: true },
        duration: { type: Number, required: true },
        preferredDate: [Date],
        scheduledAt: Date,
        timezone: { type: String, required: true },
        skillsToFocus: { type: [String], default: [] },
        applicationDeadline: { type: Date },
        applicants: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                coverLetter: { type: String, trim: true },
                proposal: { type: Number },
                status: {
                    type: String,
                    enum: ["pending", "accepted", "rejected"],
                    default: "pending",
                },
                appliedAt: { type: Date, default: Date.now },
            },
        ],
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "refunded"],
            default: "pending",
        },
        feedback: [
            {
                givenBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                rating: { type: Number, min: 0, max: 5 },
                comment: { type: String, trim: true },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const Interview =
    mongoose.models.Interview || mongoose.model("Interview", interviewModel);
export default Interview;

import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
        },
        email: {
            type: String,
            required: [true, "Please enter your Email!"],
            validate: [validator.isEmail, "Invalid Email!"],
            unique: true,
        },
        password: {
            type: String,
            required: true,
            validate: [validator.isStrongPassword, "Enter a strong Password"],
        },
        role: {
            type: String,
            enum: ["INTERVIEWEE", "INTERVIEWER", "BOTH"],
            default: "INTERVIEWEE",
        },
        age: {
            type: Number,
        },
        about: {
            type: String,
            trim: true,
        },
        location: {
            type: String,
            trim: true,
        },
        profession: {
            type: String,
        },
        skills: {
            type: [String],
            default: [],
        },
        experience: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 0,
        },
        interviewRequests: [
            {
                type: Schema.Types.ObjectId,
                ref: "InterviewRequest",
            },
        ],
        takenInterviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Interview",
            },
        ],
        isVerified: {
            type: Boolean,
            default: false,
        },
        forgotPasswordToken: String,
        forgotPasswordTokenExpiry: Date,
        verifyToken: String,
        verifyTokenExpiry: Date,
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

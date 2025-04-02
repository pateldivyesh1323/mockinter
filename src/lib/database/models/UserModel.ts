import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import { ROLES } from "@/src/constants";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: [6, "Username must be at least 6 characters long"],
            maxlength: [30, "Username must be less than 30 characters"],
        },
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
            enum: ROLES,
            default: "INTERVIEWEE",
        },
        dateOfBirth: {
            type: Date,
            required: true,
            validate: {
                validator: function (value: Date) {
                    const today = new Date();
                    const birthDate = new Date(value);
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const monthDiff = today.getMonth() - birthDate.getMonth();

                    if (
                        monthDiff < 0 ||
                        (monthDiff === 0 &&
                            today.getDate() < birthDate.getDate())
                    ) {
                        age--;
                    }

                    return age >= 10 && age <= 100;
                },
                message: "Age must be between 10 and 100",
            },
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
        experience: [
            {
                title: {
                    type: String,
                    required: true,
                },
                description: {
                    type: String,
                },
                startDate: {
                    type: Date,
                    required: true,
                },
                endDate: {
                    type: Date,
                },
                isCurrentlyWorking: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
        rating: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                value: {
                    type: Number,
                    min: 0,
                    max: 5,
                    required: true,
                },
                message: {
                    type: String,
                    trim: true,
                },
            },
        ],
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

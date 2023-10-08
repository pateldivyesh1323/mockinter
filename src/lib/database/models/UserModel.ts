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
      type: String
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
      validate: [validator.isStrongPassword, "Enter a strong Passsword"],
    },
    birthdate: {
      type: Date,
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
}

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

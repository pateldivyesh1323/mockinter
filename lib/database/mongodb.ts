import mongoose from "mongoose";

export const connectDB = async () => {
  let url = process.env.MONGO_URL;
  if (!url) throw new Error("Please provide MONGODB_URL in .env.local");
  try {
    await mongoose.connect(url, { dbName: "mockinter" });
  } catch (error) {
    console.log("Failed to connect with Database", error);
  }
};

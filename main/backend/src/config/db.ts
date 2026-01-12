import mongoose from "mongoose";

mongoose.set("bufferCommands", false);
mongoose.set("autoIndex", false);

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI not found in environment variables");
  }


  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // ⬅️ HARD STOP after 5s
    });

    console.log(" MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;

import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    const { MONGO_URI } = ENV;
    if (!MONGO_URI) throw new Error("MONGO_URI is not set");

    await mongoose.connect(ENV.MONGO_URI);
    console.log("DB connected");
  } catch (error) {
    console.log("error in connecting DB", error);
    process.exit(1); //1 status code mean fail 0 mean success
  }
};

// export default connectDB;

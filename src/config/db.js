import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI_BACKEND ? process.env.MONGO_URI_BACKEND : "", {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log(`Connected to MongoDb ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error in MongoDb is ${error}`);
  }
};

const db = mongoose.connection;

export { connectDB, db };

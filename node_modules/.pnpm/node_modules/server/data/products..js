// apps/server/src/config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv'; // Ensure dotenv is imported if not already

dotenv.config(); // Ensure dotenv is configured to load environment variables

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI); // No options needed
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
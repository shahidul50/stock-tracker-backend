import mongoose from "mongoose";

import config from "./config";
import dns from 'node:dns';

// Instructing Node.js DNS Resolver to use Google DNS (8.8.8.8)
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

export const connectDB = async () => {
  try {
    if (!config.db_url) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(config.db_url);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    throw err;
  }
};
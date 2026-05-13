import mongoose from "mongoose";
import dns from "dns";

// 🔧 Force use Google DNS to bypass network restrictions
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

export const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    console.log("Connecting to MongoDB...");

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
      ssl: true,
      tls: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host} ✅`);
  } catch (error) {
    console.error(`MongoDB Error: ${error.message} ❌`);
    console.log("Retrying in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};
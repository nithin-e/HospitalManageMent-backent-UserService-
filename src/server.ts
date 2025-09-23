import "dotenv/config";
import connectDB from "./config/mongo";
import { startGrpcServer } from "./grpc/server";

(async () => {
  console.log("Connecting to MongoDB...");
  await connectDB();
  console.log("✅ MongoDB connection successful");

  startGrpcServer();
})();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import transactionRoutes from "./routes/transactionRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// 🔒 Secret key middleware
app.use((req, res, next) => {
  const secret = req.headers.authorization;
  if (secret !== process.env.API_SECRET) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  next();
});

// 🔗 MongoDB connection
if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('your_')) {
  console.error(
    "Missing or placeholder MONGO_URI in .env. Set a valid MongoDB connection string before starting the server."
  );
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// 🚏 Routes
app.use("/api/transactions", transactionRoutes);

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import participantRoutes from "./routes/participantRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import chatRoutes from "./routes/chats.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/participants", participantRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api", chatRoutes);
// Default route
app.get("/", (req, res) => {
  res.send("🚀 Backend running successfully!");
});

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("✅ MongoDB Connected");
  app.listen(process.env.PORT, () =>
    console.log(`✅ Server on ${process.env.PORT}`)
  );
});

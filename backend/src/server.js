import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// dotenv.config({ quiet: true });
import { ENV } from "./lib/env.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import path from "path";
import { connectDB } from "./lib/db.js";

// import ENV from "dotenv";
// import { ENV } from "./lib/env.js";

// connection with data base
// connectDB();

const app = express();
const __dirname = path.resolve();

const port = ENV.PORT || 3000;

app.use(express.json()); // for parsing application/json middleware under req.body
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(port, () => {
  (console.log("server is running on port " + port), connectDB());
});

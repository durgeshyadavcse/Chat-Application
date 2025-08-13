import express from "express";
import dotenv from "dotenv"; 
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// CORS config with both localhost and deployed frontend URL
const corsOptions = {
  origin: ['http://localhost:3000', 'https://chat-applic.netlify.app'],  // deployed frontend
  credentials: true,
};

// middleware (CORS should be top-most)
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

// start server
server.listen(PORT, () => {
  connectDB();
  console.log(`Server listening on port ${PORT}`);
});

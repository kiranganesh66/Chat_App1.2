const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("../server/route/UserRoute");
const messageRoute = require("../server/route/MessagesRoute");
const socket = require("socket.io");

require("dotenv").config();
const app = express();

// CORS options to allow requests from your frontend
const corsOptions = {
  origin: "https://chat-app-kr.vercel.app", // Allow requests from this origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions)); // Use CORS middleware
app.options("*", cors(corsOptions)); // Handle preflight requests for all routes

// Middleware to handle OPTIONS requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://chat-app-kr.vercel.app");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// JSON parsing
app.use(express.json());

// API routes
app.use("/api/auth", userRoute);
app.use("/api/message", messageRoute);

// Mongoose connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Mongoose connected successfully"))
  .catch((error) => console.log(error));

// Server setup
const server = app.listen(process.env.PORT, () => {
  console.log(`Server connected at http://localhost:${process.env.PORT}`);
});

// Socket.io setup with CORS settings
const io = socket(server, {
  cors: {
    origin: "https://chat-app-kr.vercel.app",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});

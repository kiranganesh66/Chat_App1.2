const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("../server/route/UserRoute");
const messageRoute = require("../server/route/MessagesRoute");
const socket = require("socket.io");

require("dotenv").config();
const app = express();

const corsOptions = {
  origin: "https://chat-app-kr.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests for all routes

app.use(express.json());
app.use("/api/auth", userRoute);
app.use("/api/message", messageRoute);

// Mongoose connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Mongoose connected successfully"))
  .catch((error) => console.log(error));

// Server Connection
const server = app.listen(process.env.PORT, () =>
  console.log(`Server connected at http://localhost:${process.env.PORT}`)
);

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

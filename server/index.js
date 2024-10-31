const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("../server/route/UserRoute");
const messageRoute = require("../server/route/MessagesRoute");
const socket = require("socket.io");

require("dotenv").config();
const app = express();

// CORS setup
const corsOptions = {
  origin: "https://chat-app-kr.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use("/api/auth", userRoute);
app.use("/api/message", messageRoute);

// Improved Mongoose connection with error handling
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Stop server if DB connection fails
  });

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});

const io = socket(server, {
  cors: {
    origin: "https://chat-app-kr.vercel.app",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("New socket connection:", socket.id);

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

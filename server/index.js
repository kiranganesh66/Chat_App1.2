const express = require("express");
const cros = require("cors");
const mongoose = require("mongoose");
const userRoute = require("../server/route/UserRoute");
const messageRoute = require("../server/route/MessagesRoute");
const socket = require("socket.io");

require("dotenv").config();
const app = express();

const corsOptions = {
  origin: "http://localhost:5173", // allow specific origin
  methods: ["GET", "POST"], // specify allowed methods
  credentials: true, // enable cookies for cross-origin requests
};

app.use(cros(corsOptions));
app.use(express.json());
app.use("/api/auth", userRoute);
app.use("/api/message", messageRoute);

//Mongoose connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Mongoose connected successfully");
  })
  .catch((error) => {
    console.log(error);
  });

// Server Connection
const server = app.listen(process.env.PORT, (error) => {
  if (!error) {
    console.log("Server connected at the http://localhost:8000");
  } else {
    console.log("Server not connected");
  }
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:5173",
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

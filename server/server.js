const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");

const { generateMessage } = require("./utils/message");

const app = express();

const server = http.createServer(app);

const io = socketIO(server);

io.on("connection", socket => {
  console.log("new user connected");

  socket.broadcast.emit(
    "newMessage",
    generateMessage("Admin", "New User Joined")
  );

  socket.emit(
    "newMessage",
    generateMessage("Admin", "Welcome to the chat app")
  );

  socket.on("createMessage", message => {
    console.log("Create message", message);

    io.emit("newMessage", generateMessage(message.from, message.text));
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Static folder
app.use(express.static(path.join(__dirname, "../public")));

const port = process.env.PORT || 4200;

server.listen(port, () =>
  console.log(`Server up and running on port ${port}...`)
);

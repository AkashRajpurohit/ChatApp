const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = socketIO(server);

io.on("connection", socket => {
  console.log("new user connected");

  socket.broadcast.emit("newMessage", {
    from: "Admin",
    text: "New User Joined",
    createdAt: new Date().getTime()
  });

  socket.emit("newMessage", {
    from: "Admin",
    text: "Welcome to the chat app",
    createdAt: new Date().getTime()
  });

  socket.on("createMessage", message => {
    console.log("Create message", message);

    io.emit("newMessage", {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
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

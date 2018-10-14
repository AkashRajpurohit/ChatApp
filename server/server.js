const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");

const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/validation");
const { Users } = require("./utils/users");

const app = express();

const server = http.createServer(app);

const io = socketIO(server);

const users = new Users();

io.on("connection", socket => {
  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback("Name and Room are required.");
    }

    socket.join(params.room);

    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit("updateUserList", users.getUserList(params.room));

    socket.broadcast
      .to(params.room)
      .emit(
        "newMessage",
        generateMessage("Admin", `${params.name} has Joined.`)
      );

    socket.emit(
      "newMessage",
      generateMessage("Admin", "Welcome to the chat app")
    );

    callback();
  });

  socket.on("createMessage", (message, callback) => {
    io.emit("newMessage", generateMessage(message.from, message.text));
    callback();
  });

  socket.on("createLocationMessage", (coords, callback) => {
    io.emit(
      "newLocationMessage",
      generateLocationMessage("Admin", coords.latitude, coords.longitude)
    );
    callback();
  });

  socket.on("disconnect", () => {
    const user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      io.to(user.room).emit(
        "newMessage",
        generateMessage("Admin", `${user.name} has left.`)
      );
    }
  });
});

// Static folder
app.use(express.static(path.join(__dirname, "../public")));

const port = process.env.PORT || 4200;

server.listen(port, () =>
  console.log(`Server up and running on port ${port}...`)
);

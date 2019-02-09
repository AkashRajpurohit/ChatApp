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

    if (params.name.trim().length > 15) {
      return callback("Display name should be less than 15 characters");
    }

    const duplicateName = users.getUserList(params.room);

    if (duplicateName.includes(params.name)) {
      return callback(
        "Username already exists. Please choose a different username"
      );
    }

    socket.join(params.room);

    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit("updateUserList", users.getUserList(params.room));

    socket.broadcast
      .to(params.room)
      .emit(
        "newMessage",
        generateMessage(
          "Admin",
          `${
            params.name
          } has joined the party! <img alt="🤩" class="emojioneemoji" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/32/1f929.png">`
        )
      );

    socket.emit(
      "newMessage",
      generateMessage(
        "Admin",
        `Hi ${
          params.name
        }, Welcome to the ChatApp. Enjoy your time here <img alt="😁" class="emojioneemoji" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/32/1f601.png">`
      )
    );

    callback();
  });

  socket.on("createMessage", message => {
    const user = users.getUser(socket.id);
    if (user && isRealString(message.text)) {
      socket.broadcast
        .to(user.room)
        .emit("newMessage", generateMessage(user.name, message.text));
      socket.emit("selfMessage", generateMessage("Myself", message.text));

      socket.broadcast.to(user.room).emit("doneTypingMessage", "done");
    }
  });

  socket.on("createLocationMessage", (coords, callback) => {
    const user = users.getUser(socket.id);
    if (user) {
      socket.broadcast
        .to(user.room)
        .emit(
          "newLocationMessage",
          generateLocationMessage(user.name, coords.latitude, coords.longitude)
        );
      socket.emit(
        "selfLocationMessage",
        generateLocationMessage("Myself", coords.latitude, coords.longitude)
      );
      socket.broadcast.to(user.room).emit("doneTypingMessage", "done");
    }
    callback();
  });

  socket.on("typing", message => {
    const user = users.getUser(socket.id);
    if (user) {
      if (message.text == "") {
        return socket.broadcast.to(user.room).emit("doneTypingMessage", "done");
      }
      socket.broadcast
        .to(user.room)
        .emit("isTypingMessage", generateMessage(user.name, message.text));
    }
  });

  socket.on("disconnect", () => {
    const user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      io.to(user.room).emit(
        "newMessage",
        generateMessage(
          "Admin",
          `Looks like ${
            user.name
          } just left our party <img alt="🙁" class="emojioneemoji" src="https://cdn.jsdelivr.net/emojione/assets/3.1/png/32/1f641.png">`
        )
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

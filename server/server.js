const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = socketIO(server);

io.on("connection", socket => {
  console.log("new user connected");

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

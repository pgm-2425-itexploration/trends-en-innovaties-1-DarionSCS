const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", (room) => {
    console.log(`${socket.id} joined room ${room}`);
    socket.join(room);
    socket.to(room).emit("user-joined");
  });

  socket.on("offer", ({ offer, room }) => {
    console.log(`Received offer from ${socket.id} in room ${room}`);
    socket.to(room).emit("offer", offer);
  });

  socket.on("answer", ({ answer, room }) => {
    console.log(`Received answer from ${socket.id} in room ${room}`);
    socket.to(room).emit("answer", answer);
  });

  socket.on("ice-candidate", ({ candidate, room }) => {
    console.log(`Received ICE candidate from ${socket.id} in room ${room}`);
    socket.to(room).emit("ice-candidate", candidate);
  });
});

server.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});

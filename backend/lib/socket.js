//socket.io is used for real-time communication between the client and server that is built on top of Node.js's HTTP server.
// It allows us to send and receive messages from the client and server in real-time.
// Socket.IO is a JavaScript library that allows real-time, bi-directional communication between client (browser, React app) and server (Node.js/Express backend).
// It’s built on WebSockets (a protocol for persistent connections) but also provides fallbacks (like polling) for environments where WebSockets don’t work.
// Unlike HTTP (which is request-response and stateless), Socket.IO keeps a persistent connection open, so the server can push updates to the client instantly.

import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// the code is used for real-time communication between the client and server and 
// it is used inside message.controler.js file
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId; // this is provided in the useAuthstore at connectSocket() method it is used to identify the user
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {  // When a user disconnects, remove them from the online users list
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
const { Server } = require("socket.io");
let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  const onlineUsers = new Map();
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // REGISTER USER

    socket.on("registerUser",
      (userId) => {
        onlineUsers.set(
          userId,
          socket.id
        );

        console.log("Registered User:",  userId);
      }
    );

    // DISCONNECT

    socket.on("disconnect",() => {
        for (let [userId, socketId] of onlineUsers.entries()
        ) {
          if (socketId === socket.id) {
            onlineUsers.delete(userId);
            break;
          }
        }
        console.log("User disconnected");
      }
    );
  });
  return {io,onlineUsers};
};
const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = {initSocket, getIO};
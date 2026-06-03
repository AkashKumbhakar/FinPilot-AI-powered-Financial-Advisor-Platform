const { getIO } = require("../app/config/socket");

const sendNotification = (socketId,data) => {
  const io = getIO();
  io.to(socketId).emit("newNotification", data);
};

const emitExpenseAdded = (socketId,data) => {
  const io = getIO();
  io.to(socketId).emit("expenseAdded", data);
};

const emitGoalCompleted = (socketId,data) => {
  const io = getIO();
  io.to(socketId).emit("goalCompleted",data);
};

module.exports = {sendNotification, emitExpenseAdded, emitGoalCompleted};
const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {initSocket} = require("./app/config/socket");
const DatabaseConnection = require("./app/config/dbcon");
const errorMiddleware = require("./app/middlewares/errorMiddleware");

const app = express();
DatabaseConnection();
//cors
const allowedOrigins = [
  "http://localhost:3000",
  "https://fin-pilot-ai-powered-financial-advisor-platform-p9v5eh4cm.vercel.app/",
];
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

//define routes
app.use("/api",require('./app/routes/index'))

// Error middleware
app.use(errorMiddleware);

// CREATE SERVER
const server = http.createServer(app);

// INIT SOCKET
const {io, onlineUsers} = initSocket(server);

// MAKE USERS MAP GLOBAL
app.locals.io = io;
app.locals.onlineUsers = onlineUsers;

// START SERVER

const PORT = 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
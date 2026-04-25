import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors : {
        origin: [process.env.CLIENT_URL],
        credentials: true
    }
})

io.use(socketAuthMiddleware);

// this is for storing online users
const userSocketMap = {}; // {userId:socketId}

io.on("connection",(socket)=>{
    console.log("A user connected",socket.user.fullName);
    const userId = socket.userId;
    userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    // with socket.on we listen for events from clients
    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.user.fullName);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server };
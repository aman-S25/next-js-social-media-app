import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

import dotenv from 'dotenv';

dotenv.config();

const ids = new Map();
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.client_url,
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);


    socket.on('register_user', (data) => {
        ids.set(data.userId, socket.id);
        console.log(`User with username: ${data.userId} registered as: ${socket.id}`);
        console.log(ids);
    })


    socket.on('send_notification', (data) => {
        console.log(data);
        if (ids.has(data.receiverUserId)) {
            console.log(`User with socketId: ${socket.id} sent notification to: ${data.receiverUserId}`);
            io.to(ids.get(data.receiverUserId)).emit('receive_notification', data);
        }
    });

    socket.on('send_message', (data) => {
        console.log(data);
        if (ids.has(data.receiverUserId)) {
            console.log(`User with socketId: ${socket.id} sent message to: ${data.receiverUserId}`);
            io.to(ids.get(data.receiverUserId)).emit('receive_message', data);
        }
    });




    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Socket.io server is running on port ${PORT}`);
});

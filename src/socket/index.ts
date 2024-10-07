import { Server, Socket } from "socket.io";
import { Request } from "express";

// // unread count event
// const unreadCountEvent = (socket) => {
//     socket.on("unread-count", async (userId) => {
//         const notifications = await unreadNotifications(userId);
//         socket.emit("unread-count", notifications[0]);
//     });
// }

// // read all notifications event
// const readAllEvent = (socket) => {
//     socket.on("read-all", async (userId) => {
//         await readNotifications({ receiver: userId });
//     });
// }

export const initializeSocketIO = (io: Server) => {
    return io.on("connection", async (socket: Socket) => {
        try {
            const { business, type } = socket.handshake.headers;
            console.log('socket connected');

            // join the room with business ID
            socket.join(business as string);
            console.log('joined business >>>>', business);

            // join the room with type
            socket.join(type as string);
            console.log('joined type >>>>', type);

            // Common events that needs to be mounted on the initialization
            // unreadCountEvent(socket);
            // readAllEvent(socket);

            socket.on("disconnect", async () => {
                console.log("user has disconnected..", business);
            });

        } catch (error: any) {
            socket.emit("socket-error", error?.message || "Something went wrong while connecting to the socket.");
        }
    });
};

export const emitSocketEvent = (req: Request, roomId: string, event: string, payload: any): void => {
    const io: Server = req.app.get("io") as Server;
    io.in(roomId).emit(event, payload);
};
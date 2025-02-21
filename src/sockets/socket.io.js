import { Server } from "socket.io";
import userModel from "../models/user.js";
import mongoose from "mongoose";
import messageModel from "../models/message.model.js";

function initSocket(server) {
  console.log("Socket.io initialized");

  const io = new Server(server);

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.headers.token;

      if (!token) {
        return next(new Error("Token is required"));
      }

      const decodedToken = userModel.verifyToken(token);

      const user = await userModel.findById(decodedToken._id);

      if (!user) {
        return next(new Error("User Not Found"));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(err);
    }
  });

  io.on("connection", (socket) => {
    socket.join(socket.user._id.toString());

    socket.on("chat-message", async (data) => {
      try {
        const { receiver, text } = data;

        if (!text || !receiver || !text.trim() || !receiver.trim()) {
          return;
        }

        const sender = socket.user;

        const isValidReceiver = mongoose.Types.ObjectId.isValid(receiver);

        if (!isValidReceiver) {
          return;
        }

        const counterPart = await userModel.findById(receiver);

        if (!counterPart) {
          return;
        }

        await messageModel.create({
          sender: sender._id,
          receiver: counterPart._id,
          text,
        });

        io.to(receiver).emit("chat-message", {
          sender,
          receiver: counterPart,
          text,
        });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
      socket.leave(socket.user._id.toString());
    });

    console.log("user connected ");
  });
}

export default initSocket;

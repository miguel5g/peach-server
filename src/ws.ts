import { io } from "./app";
import { logger } from "./utils/logger";

io.on("connection", (socket) => {
  logger(`${socket.id} connected`);

  socket.on("disconnect", () => {
    logger(`${socket.id} disconnected`);
  });
});

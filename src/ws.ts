import { v4 as uuid } from "uuid";

import { io } from "./app";
import { randomColor } from "./utils/colors";
import { logger } from "./utils/logger";

interface Player {
  id: string;
  color: string;
  position: {
    x: number;
    y: number;
  };
}

const players: { [key: string]: Player } = {};

io.on("connection", (socket) => {
  logger(`${socket.id} connected`);

  socket.join("main");

  socket.emit("player_initial_list", Object.values(players));

  const player: Player = {
    id: uuid(),
    color: randomColor(),
    position: {
      x: 0,
      y: 0,
    },
  };

  players[socket.id] = player;

  io.to("main").emit("player_connected", player);

  socket.on("disconnect", () => {
    logger(`${socket.id} disconnected`);

    delete players[socket.id];

    socket.leave("main");

    io.to("main").emit("player_disconnected", {
      id: player.id,
    });
  });

  socket.on("player_move", (data) => {
    player.position.x = data.x;
    player.position.y = data.y;

    io.to("main").except(socket.id).emit("player_move", {
      id: player.id,
      x: data.x,
      y: data.y,
    });
  });

  socket.on("", () => {});
});

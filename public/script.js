let mainPlayer;
const players = [];
const socket = io();

function setup() {
  createCanvas(windowWidth, windowHeight);

  socket.on("player_connected", playerConnected);
  socket.on("player_disconnected", playerDisconnected);
  socket.on("player_initial_list", playerInitialList);
  socket.on("player_initial", playerInitial);
  socket.on("player_move", playerMove);
}

function draw() {
  background("gray");

  if (!mainPlayer) return;

  let mX = 0,
    mY = 0;

  if (keyIsDown(65)) --mX;

  if (keyIsDown(68)) ++mX;

  if (keyIsDown(87)) --mY;

  if (keyIsDown(83)) ++mY;

  mainPlayer.move(mX * 2, mY * 2);

  players.forEach((player) => player.draw());

  mainPlayer.draw();
}

function playerConnected(data) {
  players.push(
    new Player(data.id, data.position.x, data.position.y, data.color)
  );
}

function playerDisconnected(data) {
  players.splice(
    players.findIndex((player) => player.id === data.id),
    1
  );
}

function playerMove(data) {
  const player = players.find((player) => player.id === data.id);

  if (player) player.moveTo(data.x, data.y);
}

function playerInitial(data) {
  wsLogger("player_initial", data);

  mainPlayer = new Player(
    data.id,
    data.position.x,
    data.position.y,
    data.color
  );
}

function playerInitialList(data) {
  data.forEach((player) => {
    players.push(
      new Player(player.id, player.position.x, player.position.y, player.color)
    );
  });
}

function logger(...args) {
  console.log(...args);
}

function wsLogger(...args) {
  console.log("[socket]", ...args);
}

class Player {
  constructor(id, x, y, color) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.color = color;
  }

  draw() {
    fill(this.color);
    rect(this.x, this.y, 32, 32);
  }

  move(x, y) {
    if (x === 0 && y === 0) return;

    this.x += x;
    this.y += y;

    socket.emit("player_move", { x: this.x, y: this.y });
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }
}

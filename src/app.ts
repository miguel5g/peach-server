import express from "express";
import morgan from "morgan";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import { routes } from "./routes";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(routes);

export { server, io };

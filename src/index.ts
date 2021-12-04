import "dotenv/config";
import "./ws";

import { server } from "./app";

server.listen(process.env.PORT || 3000);

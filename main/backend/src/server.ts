import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app";
import connectDB from "./config/db";
import { initSocket } from "./sockets";
import { startAttackSimulator } from "./services/attackSimulator";

connectDB();

const PORT = process.env.PORT || 8000;

//  REQUIRED for Socket.io
const server = http.createServer(app);

//  Initialize socket engine
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//  Start simulator AFTER server is ready
startAttackSimulator(5000);

import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app";
import connectDB from "./config/db";
import { initSocket } from "./sockets";
import { startAttackSimulator } from "./services/attackSimulator";

const PORT = Number(process.env.PORT) || 8000;

(async () => {
  await connectDB();
  const server = http.createServer(app);

  initSocket(server);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startAttackSimulator(PORT);
  });
})();

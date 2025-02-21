import app from "./src/app.js";
import http from "http";
import config from "./src/config/config.js";
import connectDB from "./src/db/db.js";
import initSocket from "./src/sockets/socket.io.js";

connectDB();

const server = http.createServer(app);

initSocket(server);

server.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});

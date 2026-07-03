const app = require("./src/app.js");
const config = require("./src/config/config.js");

const connectDB = require("./src/db/db");

connectDB();
const http = require("http");

const server = http.createServer(app);

server.listen(config.PORT, () => {
  console.log("Server listening at... " + config.PORT);
});

require("dotenv").config();
const app = require("./src/app.js");

const connectDB = require("./src/db/db");

connectDB();
const http = require("http");

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log("Server listening at... " + process.env.PORT);
});

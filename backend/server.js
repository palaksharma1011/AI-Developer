const app = require("./src/app.js");
const config = require("./src/config/config.js");
const jwt = require("jsonwebtoken");

const connectDB = require("./src/db/db");
const cookie = require("cookie");

connectDB();
const http = require("http");

const server = http.createServer(app);

const io = require("socket.io")(server,{
  cors:{
    origin:config.CLIENT_URL,
    credentials:true,
  }
});

io.use((socket, next) => {
  try {
    console.log(cookie);
    console.log("Cookie header:", socket.request.headers.cookie);
    const cookies = cookie.parseCookie(socket.request.headers.cookie || "");
    console.log("Parsed cookies:", cookies);
    const token = cookies.token;

    if (!token) {
      return next(new Error("Authentication Error"));
    }

    const decoded = jwt.verify(token, config.JWT_SECRET_KEY);

    if (!decoded) {
      return next(new Error("Authentication Error"));
    }
    socket.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
});

io.on("connection", (socket) => {
  console.log("a user is connected");
  socket.on("event", (data) => {
    /* … */
  });
  socket.on("disconnect", () => {
    /* … */
  });
});

server.listen(config.PORT, () => {
  console.log("Server listening at... " + config.PORT);
});

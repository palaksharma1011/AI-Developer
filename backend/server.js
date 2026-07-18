const app = require("./src/app.js");
const config = require("./src/config/config.js");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const connectDB = require("./src/db/db");
const cookie = require("cookie");

connectDB();
const http = require("http");
const projectModel = require("./src/models/project.model.js");

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: config.CLIENT_URL,
    credentials: true,
  },
});

io.use(async (socket, next) => {
  try {
    // console.log("Handshake query:", socket.handshake.query);
    // console.log("Origin:", socket.handshake.headers.origin);
    const cookies = cookie.parseCookie(socket.request.headers.cookie || "");
    const token = cookies.token;

    if (!token) {
      return next(new Error("Authentication Error"));
    }

    const id = socket.handshake.query.id;
    if (!id) {
      return next(new Error("No id"));
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new Error("Invalid id"));
    }
    socket.project = await projectModel.findById(id);

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
  socket.roomId = socket.project._id.toString();
  console.log("a user is connected");
  socket.join(socket.roomId);

  socket.on("project-message", (data) => {
    console.log(data);
    io.to(socket.roomId).emit("project-message", data);
  });
  socket.on("event", (data) => {
    /* … */
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.leave(socket.roomId);
    /* … */
  });
});

server.listen(config.PORT, () => {
  console.log("Server listening at... " + config.PORT);
});

const app = require("./src/app.js");
const config = require("./src/config/config.js");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const connectDB = require("./src/db/db");
const cookie = require("cookie");

connectDB();
const http = require("http");
const projectModel = require("./src/models/project.model.js");
const userModel = require("./src/models/user.model.js");
const { generateResult } = require("./src/services/ai.service.js");

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
    const currUser = await userModel.findById(decoded.id);
    socket.user = currUser;
    next();
  } catch (err) {
    next(err);
  }
});

io.on("connection", (socket) => {
  socket.roomId = socket.project._id.toString();
  socket.join(socket.roomId);
  console.log(`${socket.user.username}  connected`);
  socket.to(socket.roomId).emit("user-joined", {
    username: socket.user.username,
  });

  socket.on("project-message", async (data) => {
    io.to(socket.roomId).emit("project-message", data);

    console.log(data);
    const text = data.newMsg.text.toLowerCase();
    const isAIPresent = text.includes("@ai");

    if (isAIPresent) {
      const prompt = text.replace("@ai", "");
      // const result = text;
      // console.log(result);
      const result = await generateResult(prompt);
      io.to(socket.roomId).emit("project-message", {
        newMsg: {
          id: Math.random(),
          from: "AI",
          name: "AI",
          text: result,
        },
        sender: "AI",
      });
      return;
    }
  });
  socket.on("event", (data) => {
    /* … */
  });

  socket.on("disconnect", () => {
    console.log(`${socket.user.username} disconnected`);
    socket.to(socket.roomId).emit("user-left", {
      username: socket.user.username,
    });
    socket.leave(socket.roomId);
    /* … */
  });
});

server.listen(config.PORT, () => {
  console.log("Server listening at... " + config.PORT);
});

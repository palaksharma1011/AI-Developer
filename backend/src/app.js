const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.routes");
const userRouter=require('./routes/user.routes')

const morgan = require("morgan");

const app = express();
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

// health check route

app.get("/", (req, res) => {
  res.send("WORKING CHILL");
});

app.use("/api/auth", authRouter);
app.use("/api/user",userRouter);

module.exports = app;

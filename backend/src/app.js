const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.routes");
const userRouter=require('./routes/user.routes')
const projectRouter=require('./routes/project.routes')
const aiRouter=require('./routes/ai.routes');
const config = require("./config/config");
const morgan = require("morgan");
const errorMiddleware = require("./middlewares/errorMiddleware");
const cors = require('cors')

const app = express();
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors({
    origin:[config.CLIENT_URL],
    credentials:true,
}))

// health check route

app.get("/", (req, res) => {
  res.send("WORKING CHILL");
});

app.use("/api/auth", authRouter);
app.use("/api/user",userRouter);
app.use("/api/projects",projectRouter);
app.use("/api/ai",aiRouter)

// error middleware last always

app.use(errorMiddleware);

module.exports = app;

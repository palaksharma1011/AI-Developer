const userModel = require("../models/user.model");
const redisClient = require("../services/redis.service");
const userServices = require("../services/user.service");
const asyncHandler = require("../utils/asyncHandler.js");

const userRegister = asyncHandler(async (req, res) => {
  const user = await userServices.createUser(req.body);

  const token = await user.generateJWT();
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // optional
  });
  res.status(201).json({
    message: "The user is created",
    user,
  });
});
async function userLogin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select("password");
    if (!user) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    const isMatch = await user.isValidPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    const token = await user.generateJWT();
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // optional
    });

    res.status(200).json({
      message: "User Found",
      user,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
}

// async function userLogout(req, res) {
//   res.clearCookie("token");
//   res.status(200).json({
//     message: "User logged out!!",
//   });
// }

// logout through redis - after redis setup
async function userLogout(req, res) {
  try {
    const token = req.cookies.token;

    redisClient.set(token, "logout", "EX", 60 * 60 * 24);

    res.status(200).json({
      message: "Logged OUT!!",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "error in logging out..",
    });
  }
}

module.exports = { userRegister, userLogin, userLogout };

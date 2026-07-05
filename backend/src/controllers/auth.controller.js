const userModel = require("../models/user.model");
const redisClient = require("../services/redis.service");
const userServices = require("../services/user.service");
const asyncHandler = require("../utils/asyncHandler.js");
const AppError = require("../utils/AppError.js");

const userRegister = asyncHandler(async (req, res) => {
  const user = await userServices.createUser(req.body);

  const token = await user.generateJWT();
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // optional
  });
  delete user._doc.password;
  res.status(201).json({
    message: "The user is created",
    user,
  });
});

const userLogin=asyncHandler(async(req, res) =>{
  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select("password");
  if (!user) {
    throw new AppError("Invalid Credentials", 401);
  }
  const isMatch = await user.isValidPassword(password);

  if (!isMatch) {
    throw new AppError("Invalid Credentials", 401);
  }

  const token = await user.generateJWT();
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // optional
  });

  delete user._doc.password;
  res.status(200).json({
    message: "User Found",
    user,
  });
});

// async function userLogout(req, res) {
//   res.clearCookie("token");
//   res.status(200).json({
//     message: "User logged out!!",
//   });
// }

// logout through redis - after redis setup
const userLogout=asyncHandler(async(req, res)=> {
  const token = req.cookies.token;

  redisClient.set(token, "logout", "EX", 60 * 60 * 24);

  res.status(200).json({
    message: "Logged OUT!!",
  });
});

module.exports = { userRegister, userLogin, userLogout };

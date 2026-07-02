const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const redisClient = require("../services/redis.service");
const { verifyJWT } = require("../services/verifyJWT.service");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

const userAuthMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new AppError("Please register/login", 401);
  }

  const isBlackListed = await redisClient.get(token);

  if (isBlackListed) {
    res.cookie("token", " ");
    throw new AppError("Please registerr/login", 401);
  }
  const decoded = await verifyJWT(token);
  const user = await userModel.findById(decoded.id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  req.user = user;
  next();
});

module.exports = { userAuthMiddleware };

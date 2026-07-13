const userModel = require("../models/user.model");
const userService = require("../services/user.service");

const redisClient = require("../services/redis.service");
const asyncHandler = require("../utils/asyncHandler");
async function userProfile(req, res) {
  res.status(200).json({
    message: "User profile",
    user: req.user,
  });
}

const getAllUser = asyncHandler(async (req, res) => {
  const id = req.user._id;
  const allUsers = await userService.getAllUser({ id });

  res.status(200).json({
    users: allUsers,
  });
});

module.exports = { userProfile, getAllUser };

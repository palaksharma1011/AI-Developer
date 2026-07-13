const userModel = require("../models/user.model");
const AppError = require("../utils/AppError.js");

const createUser = async ({ email, password, username, bio }) => {
  if (!email || !password || !username || !bio) {
    throw new AppError("Email,username,bio,password all are required", 400);
  }
  const HashedPassword = await userModel.hashPassword(password);

  const user = await userModel.create({
    email,
    password: HashedPassword,
    username,
    bio,
  });

  return user;
};

const getAllUser = async ({ id }) => {
  const allUsers = await userModel.find({
    _id: { $ne: id },
  });
  return allUsers;
};

module.exports = { createUser, getAllUser };

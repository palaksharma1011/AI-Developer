const userModel = require("../models/user.model");
const AppError = require('../utils/AppError.js')

const createUser = async ({ email, password }) => {
  if (!email || !password) {
throw new AppError(
    "Email and password are required",
    400
)}
  const HashedPassword = await userModel.hashPassword(password);

  const user = await userModel.create({
    email,
    password: HashedPassword,
  });

  return user;
};

module.exports = { createUser };

const userModel = require("../models/user.model");

const createUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  const HashedPassword = await userModel.hashPassword(password);

  const user = await userModel.create({
    email,
    password: HashedPassword,
  });

  return user;
};

module.exports = { createUser };

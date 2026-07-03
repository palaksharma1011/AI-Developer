const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError.js");
const config = require("../config/config.js");

async function verifyJWT(token) {
  try {
    return jwt.verify(token, config.JWT_SECRET_KEY);
  } catch (err) {
    console.log(err);
    throw new AppError("Invalid Token", 401);
  }
}
module.exports = { verifyJWT };

const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError.js");

async function verifyJWT(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    console.log(err);
    throw new AppError("Invalid Token", 401);
  }
}
module.exports = { verifyJWT };

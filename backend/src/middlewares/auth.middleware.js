const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function userAuthMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Please register/login",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decoded.id);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    req.user = user;
    next();
  }catch (err) {
    return res.status(409).json({
      message: "Invalid token",
    });
  }
}

module.exports = { userAuthMiddleware };

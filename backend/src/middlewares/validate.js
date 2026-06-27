const { validationResult } = require("express-validator");

const userAuthResult = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Valid input needed",
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

module.exports = { userAuthResult };

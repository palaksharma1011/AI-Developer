const { validationResult } = require("express-validator");

const allErrorResult = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "All Erros",
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

module.exports = { allErrorResult };

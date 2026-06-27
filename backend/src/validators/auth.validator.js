const { body } = require("express-validator");

const userAuthValidator = [
  body("email").trim().isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 3 characters"),
];

module.exports = { userAuthValidator };

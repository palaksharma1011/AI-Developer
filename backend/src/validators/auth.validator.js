const { body } = require("express-validator");

const userRegisterValidator = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),

  body("email").trim().isEmail().withMessage("Invalid email").normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Bio cannot exceed 200 characters"),
];

const userLoginValidator = [
  body("email").trim().isEmail().withMessage("Invalid email"),

  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = { userLoginValidator, userRegisterValidator };

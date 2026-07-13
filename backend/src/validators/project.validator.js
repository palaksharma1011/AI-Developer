const { body } = require("express-validator");

const projectValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Project name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Project name must be between 3 and 50 characters"),

  body("desc")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Invalid project status"),

  body("progress")
    .notEmpty()
    .withMessage("Progress is required")
    .isInt({ min: 0, max: 100 })
    .withMessage("Progress must be between 0 and 100"),

  body("stack")
    .isArray({ min: 1 })
    .withMessage("Stack must contain at least one technology"),

  body("stack.*")
    .trim()
    .notEmpty()
    .withMessage("Technology name cannot be empty"),

  body("users")
    .isArray()
    .withMessage("Users must be an array"),

  body("users.*")
    .optional()
    .isMongoId()
    .withMessage("Invalid user ID"),
];

module.exports = {
  projectValidator,
};
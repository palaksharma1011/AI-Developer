const express = require("express");
const Router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const projectValidator = require("../validators/project.validator");

const projectController = require("../controllers/project.controller");
const validate = require("../middlewares/validate");

Router.post(
  "/create",
  validate.allErrorResult,
  authMiddleware.userAuthMiddleware,
  projectValidator.projectBodyValidator,
  projectController.createNewProject,
);

Router.get(
  "/getAllProjects",
  validate.allErrorResult,
  authMiddleware.userAuthMiddleware,
  projectController.showAllProjectsByUser,
);
Router.post(
  "/adduser/:projectID",
  validate.allErrorResult,
  authMiddleware.userAuthMiddleware,
  projectController.addUserToProject,
);

module.exports = Router;

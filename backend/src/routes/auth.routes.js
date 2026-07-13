const express = require("express");

const Router = express.Router();
const authValidators = require("../validators/auth.validator");
const validate = require("../middlewares/validate");
const authController = require("../controllers/auth.controller");

const authMiddleware = require("../middlewares/auth.middleware");

Router.post(
  "/register",
  authValidators.userRegisterValidator,
  validate.allErrorResult,
  authController.userRegister,
);
Router.post(
  "/login",
  authValidators.userLoginValidator,
  validate.allErrorResult,
  authController.userLogin,
);

Router.get(
  "/logout",
  authMiddleware.userAuthMiddleware,
  authController.userLogout,
);

module.exports = Router;

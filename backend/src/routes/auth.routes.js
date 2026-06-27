const express = require("express");

const Router = express.Router();
const authValidators = require("../validators/auth.validator");
const validate = require("../middlewares/validate");
const authController = require("../controllers/auth.controller");

Router.post(
  "/register",
  authValidators.userAuthValidator,
  validate.userAuthResult,
  authController.userRegister,
);
Router.post(
  "/login",
  authValidators.userAuthValidator,
  validate.userAuthResult,
  authController.userLogin,
);

Router.get("/logout",authController.userLogout)


module.exports = Router;

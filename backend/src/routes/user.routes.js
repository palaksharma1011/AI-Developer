const express = require("express");
const Router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const userController=require('../controllers/user.controller');

// Protected routes for user
Router.get(
  "/profile",
  authMiddleware.userAuthMiddleware,
  userController.userProfile,
);

module.exports = Router;

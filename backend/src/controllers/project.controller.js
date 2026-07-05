
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const projectService=require('../services/project.service');

const createNewProject = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const userID = req.user._id;
  const project = await projectService.createProject({name, userID});

  res.status(201).json({
    message: "Project created",
    project: project,
    user: req.user.email,
  });
});

module.exports = { createNewProject };

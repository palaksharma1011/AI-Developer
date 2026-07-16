const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const projectService = require("../services/project.service");

const createNewProject = asyncHandler(async (req, res) => {
  const { name, desc, status, progress, stack } = req.body;
  const userID = req.user._id;
  const project = await projectService.createProject({
    name,
    userID,
    desc,
    status,
    progress,
    stack,
  });

  res.status(201).json({
    message: "Project created",
    project: project,
    user: req.user.email,
  });
});

const showAllProjectsByUser = asyncHandler(async (req, res) => {
  const id = req.user._id;

  const projects = await projectService.showAllProjects({ id });

  res.status(200).json({
    message: "ALL projects fetched",
    projects,
  });
});

const addUserToProject = asyncHandler(async (req, res) => {
  const { anotherIDs } = req.body;
  const { projectID } = req.params;

  const project = await projectService.addUserToProject({
    anotherIDs,
    projectID,
  });

  res.status(200).json({
    message: "Users added to project",
    project: project,
  });
});

const getProject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const project = await projectService.getProject({ id });

  res.status(200).json({
    message: "Project fetched",
    project: project,
  });
});
const getOtherUsers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const users = await projectService.getOtherUsers({ id });
  res.status(200).json({
    message: "All users not in project fetched",
    users: users,
  });
});

module.exports = {
  createNewProject,
  showAllProjectsByUser,
  addUserToProject,
  getProject,
  getOtherUsers,
};

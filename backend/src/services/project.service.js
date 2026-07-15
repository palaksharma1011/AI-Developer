const projectModel = require("../models/project.model");
const AppError = require("../utils/AppError");
const userModel = require("../models/user.model");

const createProject = async ({
  name,
  userID,
  desc,
  status,
  progress,
  stack,
}) => {
  if (!name || !userID || !desc || !status || !progress || !stack) {
    throw new AppError("Provide all details of project", 400);
  }
  const isExists = await projectModel.findOne({
    name: name,
  });
  if (isExists) {
    throw new AppError("Project name is already registered", 400);
  }
  console.log("stack is", stack);

  const project = await projectModel.create({
    name,
    users: [userID],
    desc,
    status,
    progress,
    stack: stack,
  });
  return project;
};

const showAllProjects = async ({ id }) => {
  if (!id) {
    throw new AppError("ID is required", 400);
  }
  const user = await userModel.findById(id);
  if (!user) {
    throw new AppError("User not found", 400);
  }
  const projects = await projectModel.find({
    users: id,
  });
  if (!projects) {
    throw new AppError("No projects Found", 400);
  }
  return projects;
};

const addUserToProject = async ({ anotherID, projectID }) => {
  if (!anotherID) {
    throw new AppError("anotherID not provided");
  }
  if (!projectID) {
    throw new AppError("project Id not provided");
  }
  const user = await userModel
    .findById(anotherID);
  if (!user) {
    throw new AppError("Invalid userID");
  }
  const projectExists = await projectModel.findById(projectID);

  if (!projectExists) {
    throw new AppError("No projects Found", 400);
  }


  const project = await projectModel.findByIdAndUpdate(projectID, {
    $push: {
      users: {
        $each: [anotherID],
      },
    },
  });

  return project;
};

const getProject = async ({ id }) => {
  if (!id) {
    throw new AppError("id not provided");
  }

  const project = await projectModel.findById(id);
  if (!project) {
    throw new AppError("project not provided");
  }
  return project;
};

module.exports = {
  createProject,
  showAllProjects,
  addUserToProject,
  getProject,
};

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

const addUserToProject = async ({ anotherIDs, projectID }) => {
  if (!anotherIDs) {
    throw new AppError("No anotherID provided");
  }
  if (!projectID) {
    throw new AppError("project Id not provided");
  }
  // const user = await userModel
  //   .findById(anotherID);
  // if (!user) {
  //   throw new AppError("Invalid userID");
  // }
  const projectExists = await projectModel.findById(projectID);

  if (!projectExists) {
    throw new AppError("No projects Found", 400);
  }
  console.log(anotherIDs);

  const project = await projectModel.findByIdAndUpdate(projectID, {
    $push: {
      users: {
        $each: anotherIDs,
      },
    },
  });

  return project;
};

const getProject = async ({ id }) => {
  if (!id) {
    throw new AppError("id not provided");
  }

  const project = await projectModel
    .findById(id)
    .populate("users", "username email");
  if (!project) {
    throw new AppError("project not provided");
  }
  return project;
};

const getOtherUsers = async ({ id }) => {
  if (!id) {
    throw new AppError("No id for project provided");
  }

  const project = await projectModel.findById(id);
  if (!project) {
    throw new AppError("Invalid project id");
  }

  const excludeUsers = [...project.users];

  const allUsers = await userModel.find({
    _id: {
      $nin: excludeUsers,
    },
  });
  return allUsers;
};

module.exports = {
  createProject,
  showAllProjects,
  addUserToProject,
  getProject,
  getOtherUsers,
};

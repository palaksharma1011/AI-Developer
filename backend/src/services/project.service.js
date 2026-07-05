const projectModel = require("../models/project.model");
const AppError = require("../utils/AppError");

const createProject = async ({ name, userID }) => {
  if (!name) {
    throw new AppError("name is required", 400);
  }
  if (!userID) {
    throw new AppError("userID not found", 400);
  }
  const isExists=await projectModel.findOne({
    name:name
  })
  if(isExists){
    throw new AppError("Project name is already registered",400);
  }

  const project = await projectModel.create({
    name,
    users: [userID],
  });
  return project;
};

module.exports = { createProject };

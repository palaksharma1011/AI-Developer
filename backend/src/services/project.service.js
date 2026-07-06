const projectModel = require("../models/project.model");
const AppError = require("../utils/AppError");
const userModel = require("../models/user.model");

const createProject = async ({ name, userID }) => {
  if (!name) {
    throw new AppError("name is required", 400);
  }
  if (!userID) {
    throw new AppError("userID not found", 400);
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

const addUserToProject = async ({ anotherUserEmail, projectID }) => {
  if (!anotherUserEmail) {
    throw new AppError("anotherUserEmail not provided");
  }
  if (!projectID) {
    throw new AppError("project Id not provided");
  }
  const userID = await userModel.findOne({
    email: anotherUserEmail,
  }).select('_id');
  if (!userID) {
    throw new AppError("Invalid User email");
  }
  const projectExists = await projectModel.findById(projectID);

  if (!projectExists) {
    throw new AppError("No projects Found", 400);
  }

  const userInProject=await projectModel.exists(
{    _id:projectID,
    users:userID}
  )
  if(userInProject){
    throw new AppError("User Already in Project",400);
}

const project=await projectModel.findByIdAndUpdate(projectID,
   { $push:{
        users:{
            $each:[
                userID
            ]
        }
    }}
)

  return project;
};

module.exports = { createProject, showAllProjects, addUserToProject };

const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const projectService = require("../services/project.service");

const createNewProject = asyncHandler(async (req, res) => {
  const { name, desc, status, progress , stack } = req.body;
  const userID = req.user._id;
  const project = await projectService.createProject({
    name,
    userID,
    desc,
    status,
    progress,
    stack
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
  const { anotherUserEmail } = req.body;
  const { projectID } = req.params;

  const project = await projectService.addUserToProject({
    anotherUserEmail,
    projectID,
  });

  res.status(200).json({
    message: "Following user added to project",
    anotherUser: req.body.anotherUserEmail,
    project: project,
  });
});

const getProject=asyncHandler(async (req,res)=>{
    const {id}=req.params;

    const project=await projectService.getProject({id});

    res.status(200).json({
        message:"Project fetched",
        project:project
    })
})

module.exports = { createNewProject, showAllProjectsByUser, addUserToProject,getProject };

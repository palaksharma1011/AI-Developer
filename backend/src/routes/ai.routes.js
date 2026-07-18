const express = require("express");

const Router = express.Router();
const aiController=require('../controllers/ai.controller');

Router.get('/getResult',aiController.getResult);
module.exports=Router;
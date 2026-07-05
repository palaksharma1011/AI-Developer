const {body}=require("express-validator");

const projectBodyValidator=[
    body("name")
        .isString()
        .withMessage("Name is required")
]

module.exports={projectBodyValidator};
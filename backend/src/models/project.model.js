const mongoose=require('mongoose');

const projectSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        unique:true
    },
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    }]
})

const projectModel=mongoose.model('projects',projectSchema);

module.exports=projectModel; 
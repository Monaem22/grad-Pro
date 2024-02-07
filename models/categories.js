const { default: mongoose } = require("mongoose")

const categoryschema=new mongoose.Schema({
    name:{
        type:String,
        require:[true,"category require"],
        unique:[true,"category must be unique"],
        minlength:[3,"too short category name"],
        maxlenght:[32,"too long category name"]
    },
    //A and B=>shoping.com/a-and-b
    slug:{
        type:String,
        lowercase:true
    },
},{timestamps:true})



const categorymodel=mongoose.model("category",categoryschema,)

module.exports=categorymodel
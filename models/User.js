const mongoose=require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true

        },
        address:{
            type:String // optional
        },
        mobilenumber:{
            type:String

        },
        role:{
            type:String,
            default:"normal"
        }
        
    },
    {
        timestamps:true
    }
)
module.exports=mongoose.model(
    "User",UserSchema
)
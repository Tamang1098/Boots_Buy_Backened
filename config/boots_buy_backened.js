const mongoose =require("mongoose")
const CONNECTION_STRING=process.env.MONGODB_URI 
 
const connectBOOTS_BUY_BACKENED=async() =>{
    try{
        await mongoose.connect(
           CONNECTION_STRING,
            {
                useNewUrlParser:true,
                useUnifiedTopology:true
            }
        )
        console.log("Mongodb Connected")
    }catch (err){
        console.log("BOOTS_BUY_BACKENED Err",err)
    }
}
module.exports=connectBOOTS_BUY_BACKENED
 
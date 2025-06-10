const mongoose =require("mongoose")
const CONNECTION_STRING=process.env.MONGODB_URL
 
const connectBOOTS_BUY_BACKENED=async() =>{
    try{
        await mongoose.connect(
           CONNECTION_STRING,
            {
                useNewUrlParser:true,
                useUnifiedTopology:true
            }
        )
    }catch (err){
        console.log("BOOTS_BUY_BACKENED Err",err)
    }
}
module.exports=connectBOOTS_BUY_BACKENED
 
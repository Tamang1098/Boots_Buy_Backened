const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        filepath:{type:String},
        price:{
            type:Number,
            required:true
        },
        brandId:{
            type:  mongoose.Schema.ObjectId, // foreign key/referencing
            ref:'Brand',
            required:true
        }
        // sellerId:{
        //     type:mongoose.Schema.ObjectId, // foreign key/referencing
        //     ref:'User',
        //     required:true
        // }, 
    }
)

module.exports = mongoose.model(
    'Product',productSchema
)
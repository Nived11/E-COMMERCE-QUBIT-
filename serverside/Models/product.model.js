import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } ,
    productname:{type:String,require:true},
    category:{type:String,require:true},
    Brand:{type:String,require:true},
    modelno:{type:String,require:true},
    price:{type:String,require:true},
    quantity:{type:String,require:true},
    warranty:{type:String,require:true},
    description:{type:String,require:true},
    specifications:{type:String,require:true},
    productimages:{type:Array,require:true},
});


export default mongoose.model.product||mongoose.model("product",productSchema)
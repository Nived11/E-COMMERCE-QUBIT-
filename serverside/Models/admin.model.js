import mongoose from "mongoose";

const adminSchema=new mongoose.Schema({
    email:{type:String,require:true},
    password:{type:String,require:true},
});



export default mongoose.model.admin||mongoose.model("admin",adminSchema)
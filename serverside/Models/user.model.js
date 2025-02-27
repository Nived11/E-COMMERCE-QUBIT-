import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    
    fname:{type:String,require:true},
    lname:{type:String,require:true},
    email:{type:String,require:true},
    phone:{type:String,require:true},
    password:{type:String,require:true},
    accountType:{type:String,require:true},
    companyName:{type:String},
    companyProof:{type:String}
});



export default mongoose.model.User||mongoose.model("User",userSchema)
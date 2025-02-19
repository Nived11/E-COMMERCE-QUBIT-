import mongoose from "mongoose";

const addressSchema=new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } ,
    name:{type:String,require:true},
    phone:{type:String,require:true},
    housename:{type:String,require:true},
    area:{type:String,require:true},
    landmark:{type:String,require:true},
    city:{type:String,require:true},
    state:{type:String,require:true},
    pincode:{type:String,require:true},
});



export default mongoose.model.address||mongoose.model("address",addressSchema)
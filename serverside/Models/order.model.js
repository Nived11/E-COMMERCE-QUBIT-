import mongoose from "mongoose";

const OrderSchema=new mongoose.Schema({
    userId:{type:String,require:true},
    email:{type:String,require:true},
    address:{type:Object,require:true},
    products:[{type:Object,require:true}],
    totalAmount:{type:String,require:true},
    orderDate:{type:Date,default:Date.now},
    estimateDate:{type:Date,}
     
   
});


export default mongoose.model.Order||mongoose.model("Order",OrderSchema)
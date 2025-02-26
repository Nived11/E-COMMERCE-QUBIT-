import mongoose from "mongoose";

const cartSchema=new mongoose.Schema({
    userId:{type:String,require:true},
    productId:{type:String,require:true}
   
});


export default mongoose.model.Cart||mongoose.model("Cart",cartSchema)
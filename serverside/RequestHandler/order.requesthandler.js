import OrderSchema from "../Models/order.model.js";
import userSchema from "../Models/user.model.js";
import productSchema from "../Models/product.model.js";


export async function sendOrder(req,res) {
    try {
        const {userId,email,address,products,totalAmount,orderDate,estimateDate}=req.body;
        console.log(userId,email,address,products,totalAmount,orderDate,estimateDate);
        await OrderSchema.create({userId,email,address,products,totalAmount,orderDate,estimateDate});
        res.status(201).send({msg:"Order placed successfully"});
    } catch (error) {
        res.status(500).send({error});
    }
}
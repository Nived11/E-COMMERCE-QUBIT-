import cartSchema from "../Models/cart.model.js";
import productSchema from "../Models/product.model.js";
import mongoose from "mongoose";

export async function addCart(req, res) {
    try {
        const { userId, productId } = req.body;
        console.log(userId, productId);
        if (!(userId && productId)) {
            return res.status(404).send({ msg: "Fields are empty" });
        }
        await cartSchema.create({ userId, productId });
        res.status(201).send({ msg: "Product added successfully" });

    } catch (error) {
        console.log(error);
        
        res.status(500).send({ error });
        
    }
}


export async function showCart(req, res) {
    try {
        const {userId}=req.body;
        console.log("ussser id ",userId);
        const cartItems= await cartSchema.find({userId})
        console.log(cartItems);

        const productIds=cartItems.map(item=>new mongoose.Types.ObjectId(item.productId));

        const product=await productSchema.find({_id:{$in:productIds}});

        console.log("cart Product : ",product);
        
        return res.status(200).json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error });
    }
}

export async function deleteCart(req, res) {
    try {
        const { id } = req.params;
        const deletedCart = await cartSchema.findOneAndDelete({productId:id});

        res.status(200).send({ msg: "product removed successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error });
    }
}

export async function removeAllfromcart(req,res){
    try {
        const {id}=req.body;
        await cartSchema.deleteMany({userId:id});
        res.status(200).send({msg:"Cart cleared successfully"});
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error });
    }
}
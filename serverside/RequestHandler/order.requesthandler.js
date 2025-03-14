import OrderSchema from "../Models/order.model.js";
import productSchema from "../Models/product.model.js"; 

export async function sendOrder(req, res) {
    try {
        const orderData = req.body.orderData || req.body;
        const {userId, email, address, products, totalAmount} = orderData;
        
        const newOrder = await OrderSchema.create({
            userId,
            email,
            address,
            products,
            totalAmount,
            orderDate: new Date(),
            estimateDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) 
        });
        
        for (const item of products) {
            const productId = item._id;
            const orderedQuantity = item.quantity || 1; 
            const product = await productSchema.findById(productId);
            
            if (product) {
                const updatedQuantity = product.quantity - orderedQuantity;
                // Ensure quantity doesn't go below zero
                const newQuantity = updatedQuantity >= 0 ? updatedQuantity : 0;
                await productSchema.findByIdAndUpdate(productId,  { quantity: newQuantity });
            }
        }
        
        res.status(201).send({msg:"Order placed successfully"});
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).send({error: error.message});
    }
}

export async function getOrder(req, res) {
    try {
        const { userId } = req.body; 
        console.log("User ID:", userId);
        
        const orders = await OrderSchema.find({ userId });

        if (!orders.length) {
            return res.status(404).send({ msg: "No orders found for this user" });
        }

        res.status(200).send(orders); 
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}
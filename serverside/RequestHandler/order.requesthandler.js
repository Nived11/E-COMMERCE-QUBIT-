import OrderSchema from "../Models/order.model.js";
import productSchema from "../Models/product.model.js"; // Import the product schema

export async function sendOrder(req, res) {
    try {
        // console.log("Request body:", req.body); 
        const orderData = req.body.orderData || req.body;
        const {userId, email, address, products, totalAmount} = orderData;
        
        // Create the order first
        const newOrder = await OrderSchema.create({
            userId,
            email,
            address,
            products,
            totalAmount,
            orderDate: new Date(),
            estimateDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) 
        });
        
        // Update product quantities
        for (const item of products) {
            const productId = item._id;
            const orderedQuantity = item.quantity || 1; // Default to 1 if quantity is not specified
            
            // Find the product and update its quantity
            const product = await productSchema.findById(productId);
            
            if (product) {
                const updatedQuantity = product.quantity - orderedQuantity;
                
                // Ensure quantity doesn't go below zero
                const newQuantity = updatedQuantity >= 0 ? updatedQuantity : 0;
                
                // Update the product quantity
                await productSchema.findByIdAndUpdate(
                    productId, 
                    { quantity: newQuantity }
                );
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
        const { userId } = req.body; // Get userId from request params
        console.log("User ID:", userId);
        
        const orders = await OrderSchema.find({ userId });

        if (!orders.length) {
            return res.status(404).send({ msg: "No orders found for this user" });
        }

        res.status(200).send(orders); // Return all orders of the user
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}
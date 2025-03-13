import OrderSchema from "../Models/order.model.js";

export async function sendOrder(req, res) {
    try {
        // console.log("Request body:", req.body); 
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
        res.status(201).send({msg:"Order placed successfully"});
    } catch (error) {
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

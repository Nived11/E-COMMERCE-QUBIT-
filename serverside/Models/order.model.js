import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    email: {type: String, required: true},
    address: {type: Object, required: true},
    products: [{type: Object, required: true}],
    totalAmount: {type: String, required: true},
    orderDate: {type: Date, default: Date.now},
    estimateDate: {type: Date}
});

export default mongoose.model.Order || mongoose.model("Order", OrderSchema);
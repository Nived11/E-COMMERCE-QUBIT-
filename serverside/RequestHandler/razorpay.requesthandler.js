import Razorpay from 'razorpay';
import crypto from 'crypto';



const razorpay = new Razorpay({
   key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_L1qbmYu5Ctpty3",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "LyMXgrMImF0cHd3jhZIeNshD"
});

export async function createRazorpayOrder(req, res) {
  try {
    const { amount, currency, receipt } = req.body;
    
    // Validate required fields
    if (!amount || !currency || !receipt) {
      return res.status(400).send({ error: "Amount, currency, and receipt are required" });
    }
    
    // Create order
    const options = {
      amount: amount, // Amount in the smallest currency unit (paise for INR)
      currency: currency,
      receipt: receipt,
      payment_capture: 1 // Auto-capture
    };
    
    const order = await razorpay.orders.create(options);
    
    res.status(200).send(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).send({ error: error.message });
  }
}

export async function verifyPayment(req, res) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    
    // Validate required fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).send({ error: "All payment details are required" });
    }
    
    // Create a signature hash to verify the payment
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');
    
    // Compare our digest with the actual signature
    if (digest !== razorpay_signature) {
      return res.status(400).send({ error: "Transaction not legitimate" });
    }
    
    // Payment is legit
    res.status(200).send({ status: "success", message: "Payment verified successfully" });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).send({ error: error.message });
  }
}
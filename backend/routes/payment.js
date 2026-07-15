import express from "express";
import Razorpay from "razorpay";

const router = express.Router();

const razorpayKeyId = process.env.RAZORPAY_KEY_ID || "YOUR_RAZORPAY_KEY_ID";
const razorpayKeySecret =
  process.env.RAZORPAY_SECRET ||
  process.env.RAZORPAY_KEY_SECRET ||
  "YOUR_RAZORPAY_KEY_SECRET";

export const isRazorpayConfigured =
  razorpayKeyId !== "YOUR_RAZORPAY_KEY_ID" &&
  razorpayKeySecret !== "YOUR_RAZORPAY_KEY_SECRET";

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

router.post("/", async (req, res) => {
  const amount = Number(req.body.amount || 0);

  if (!amount) {
    return res.status(400).json({ message: "Amount is required" });
  }

  if (!isRazorpayConfigured) {
    return res.json({
      id: `order_demo_${Date.now()}`,
      keyId: razorpayKeyId,
      amount: amount * 100,
      currency: "INR",
      demo: true,
    });
  }

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `stationery_${Date.now()}`,
    });

    res.json({ ...order, keyId: razorpayKeyId });
  } catch (error) {
    console.error("Razorpay order failed:", error.message);
    res.json({
      id: `order_fallback_${Date.now()}`,
      keyId: razorpayKeyId,
      amount: amount * 100,
      currency: "INR",
      fallback: true,
    });
  }
});

export default router;

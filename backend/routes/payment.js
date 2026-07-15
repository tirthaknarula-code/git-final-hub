import express from "express";
import Razorpay from "razorpay";

const router = express.Router();

function getRazorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID || "YOUR_RAZORPAY_KEY_ID";
  const keySecret =
    process.env.RAZORPAY_SECRET ||
    process.env.RAZORPAY_KEY_SECRET ||
    "YOUR_RAZORPAY_KEY_SECRET";

  return {
    keyId,
    keySecret,
    configured:
      keyId !== "YOUR_RAZORPAY_KEY_ID" &&
      keySecret !== "YOUR_RAZORPAY_KEY_SECRET" &&
      keyId.startsWith("rzp_"),
  };
}

export function isRazorpayReady() {
  return getRazorpayConfig().configured;
}

router.post("/", async (req, res) => {
  const amount = Number(req.body.amount || 0);

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Amount is required" });
  }

  const { keyId, keySecret, configured } = getRazorpayConfig();

  if (!configured) {
    return res.status(503).json({
      message: "Razorpay keys are not configured",
      demo: true,
    });
  }

  try {
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `stationery_${Date.now()}`,
    });

    res.json({ ...order, keyId });
  } catch (error) {
    console.error("Razorpay order failed:", error.message);
    res.status(502).json({
      message: "Razorpay order failed",
      error: error.message,
    });
  }
});

export default router;
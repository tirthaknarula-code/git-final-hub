import express from "express";
import { db, toOrder } from "../db.js";

const router = express.Router();

router.post("/orders", async (req, res) => {
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const total = Number(req.body.total || 0);
  const paymentMode = req.body.paymentMode || "manual-checkout";
  const status = req.body.status || "pending-payment";

  const [result] = await db.query(
    `INSERT INTO orders
      (total, payment_mode, status, razorpay_order_id, razorpay_payment_id)
     VALUES (?, ?, ?, ?, ?)`,
    [
      total,
      paymentMode,
      status,
      req.body.razorpayOrderId || null,
      req.body.razorpayPaymentId || null,
    ],
  );

  if (items.length > 0) {
    await db.query(
      `INSERT INTO order_items
        (order_id, product_title, brand, price, quantity, is_free)
       VALUES ?`,
      [
        items.map((item) => [
          result.insertId,
          item.title || "Stationery Item",
          item.brand || "",
          Number(item.price || 0),
          Number(item.quantity || 1),
          Boolean(item.isFree),
        ]),
      ],
    );
  }

  const [rows] = await db.query("SELECT * FROM orders WHERE id = ?", [
    result.insertId,
  ]);
  res.status(201).json(toOrder(rows[0], items));
});

router.patch("/orders/:id", async (req, res) => {
  const updates = [];
  const values = [];

  if (req.body.status) {
    updates.push("status = ?");
    values.push(req.body.status);
  }
  if (req.body.paymentMode) {
    updates.push("payment_mode = ?");
    values.push(req.body.paymentMode);
  }
  if (req.body.razorpayPaymentId) {
    updates.push("razorpay_payment_id = ?");
    values.push(req.body.razorpayPaymentId);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: "No valid order update provided" });
  }

  values.push(req.params.id);
  await db.query(`UPDATE orders SET ${updates.join(", ")} WHERE id = ?`, values);

  const [rows] = await db.query("SELECT * FROM orders WHERE id = ?", [
    req.params.id,
  ]);

  if (rows.length === 0) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(toOrder(rows[0]));
});

export default router;

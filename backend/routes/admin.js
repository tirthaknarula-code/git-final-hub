import express from "express";
import { db } from "../db.js";
import { requireAdminPassword } from "../middleware/adminAuth.js";

const router = express.Router();

router.use(requireAdminPassword);

router.get("/summary", async (req, res) => {
  const [[sales]] = await db.query(`
    SELECT
      COUNT(*) AS totalOrders,
      COALESCE(SUM(total), 0) AS totalSales,
      COALESCE(SUM(CASE WHEN status = 'paid' THEN total ELSE 0 END), 0) AS paidSales
    FROM orders
  `);
  const [[products]] = await db.query("SELECT COUNT(*) AS totalProducts FROM products");
  const [[users]] = await db.query("SELECT COUNT(*) AS totalUsers FROM users");
  const [[sold]] = await db.query(`
    SELECT COALESCE(SUM(quantity), 0) AS soldItems
    FROM order_items
    WHERE is_free = FALSE
  `);

  res.json({ ...sales, ...products, ...users, ...sold });
});

router.get("/orders", async (req, res) => {
  const [orders] = await db.query(`
    SELECT
      o.id,
      o.total,
      o.payment_mode AS paymentMode,
      o.status,
      o.razorpay_order_id AS razorpayOrderId,
      o.razorpay_payment_id AS razorpayPaymentId,
      o.customer_name AS customerName,
      o.phone,
      o.address,
      o.city,
      o.pincode,
      o.created_at AS createdAt,
      GROUP_CONCAT(CONCAT(oi.product_title, ' x', oi.quantity) SEPARATOR ', ') AS items
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    GROUP BY o.id
    ORDER BY o.id DESC
  `);

  res.json(orders);
});

router.get("/products", async (req, res) => {
  const [products] = await db.query(`
    SELECT
      p.id,
      p.title,
      p.brand,
      p.price,
      p.image,
      p.description,
      p.in_stock AS inStock,
      COALESCE(SUM(oi.quantity), 0) AS sold
    FROM products p
    LEFT JOIN order_items oi
      ON oi.product_title = p.title AND oi.is_free = FALSE
    GROUP BY p.id
    ORDER BY p.id DESC
  `);

  res.json(products);
});

router.get("/users", async (req, res) => {
  const [users] = await db.query(
    "SELECT id, name, email, provider, created_at AS createdAt FROM users ORDER BY id DESC",
  );
  res.json(users);
});

router.get("/contact-messages", async (req, res) => {
  const [messages] = await db.query(
    "SELECT id, name, email, message, created_at AS createdAt FROM contact_messages ORDER BY id DESC",
  );
  res.json(messages);
});

router.delete("/orders/:id", async (req, res) => {
  const [result] = await db.query("DELETE FROM orders WHERE id = ?", [req.params.id]);
  if (result.affectedRows === 0) return res.status(404).json({ message: "Order not found" });
  res.json({ message: "Order deleted" });
});

router.delete("/users/:id", async (req, res) => {
  const [result] = await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
  if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted" });
});

router.delete("/contact-messages/:id", async (req, res) => {
  const [result] = await db.query("DELETE FROM contact_messages WHERE id = ?", [req.params.id]);
  if (result.affectedRows === 0) return res.status(404).json({ message: "Message not found" });
  res.json({ message: "Message deleted" });
});
export default router;

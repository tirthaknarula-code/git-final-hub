import express from "express";
import { db, seedDatabase } from "../db.js";

const router = express.Router();

router.get("/products", async (req, res) => {
  const [products] = await db.query("SELECT * FROM products ORDER BY id DESC");
  res.json(products);
});

router.post("/seed", async (req, res) => {
  await db.query("DELETE FROM order_items");
  await db.query("DELETE FROM orders");
  await db.query("DELETE FROM products");
  await db.query("ALTER TABLE products AUTO_INCREMENT = 1");
  await seedDatabase();

  const [[{ count }]] = await db.query("SELECT COUNT(*) AS count FROM products");
  res.json({ message: "Products seeded in MySQL", count });
});

export default router;

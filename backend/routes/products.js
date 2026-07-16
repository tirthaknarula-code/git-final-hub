import express from "express";
import { db, seedDatabase } from "../db.js";
import { requireAdminPassword } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/products", async (req, res) => {
  const [products] = await db.query("SELECT * FROM products ORDER BY id DESC");
  res.json(products);
});

router.post("/products", requireAdminPassword, async (req, res) => {
  const title = String(req.body.title || "").trim();
  const brand = String(req.body.brand || "DOMS").trim() || "DOMS";
  const price = Number(req.body.price || 0);
  const image = String(req.body.image || "").trim();
  const description = String(req.body.description || "").trim();

  if (!title || !price || !image || !description) {
    return res.status(400).json({
      message: "Title, price, image and description are required",
    });
  }

  const [result] = await db.query(
    "INSERT INTO products (title, brand, price, image, description) VALUES (?, ?, ?, ?, ?)",
    [title, brand, price, image, description],
  );

  const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [
    result.insertId,
  ]);

  res.status(201).json(rows[0]);
});
router.post("/seed", async (req, res) => {
  await seedDatabase();

  const [[{ count }]] = await db.query("SELECT COUNT(*) AS count FROM products");
  res.json({ message: "Default products checked in MySQL", count });
});

export default router;



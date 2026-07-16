import express from "express";
import multer from "multer";
import path from "path";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { db, seedDatabase } from "../db.js";
import { requireAdminPassword } from "../middleware/adminAuth.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.join(__dirname, "..");
const productImageDir = path.join(backendDir, "images", "products");

mkdirSync(productImageDir, { recursive: true });

const storage = multer.diskStorage({
  destination: productImageDir,
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});

function cleanProduct(body, file) {
  return {
    title: String(body.title || "").trim(),
    brand: String(body.brand || "DOMS").trim() || "DOMS",
    price: Number(body.price || 0),
    image: file ? `/images/products/${file.filename}` : String(body.image || "").trim(),
    description: String(body.description || "").trim(),
    inStock: body.inStock === "false" || body.inStock === false || body.in_stock === false ? false : true,
  };
}

router.get("/products", async (req, res) => {
  const [products] = await db.query("SELECT id, title, brand, price, image, description, in_stock AS inStock FROM products ORDER BY id DESC");
  res.json(products);
});

router.post("/products", requireAdminPassword, upload.single("imageFile"), async (req, res) => {
  const product = cleanProduct(req.body, req.file);

  if (!product.title || !product.price || !product.image || !product.description) {
    return res.status(400).json({
      message: "Title, price, image and description are required",
    });
  }

  const [result] = await db.query(
    "INSERT INTO products (title, brand, price, image, description, in_stock) VALUES (?, ?, ?, ?, ?, ?)",
    [product.title, product.brand, product.price, product.image, product.description, product.inStock],
  );

  const [rows] = await db.query(
    "SELECT id, title, brand, price, image, description, in_stock AS inStock FROM products WHERE id = ?",
    [result.insertId],
  );

  res.status(201).json(rows[0]);
});

router.put("/products/:id", requireAdminPassword, upload.single("imageFile"), async (req, res) => {
  const id = Number(req.params.id);
  const product = cleanProduct(req.body, req.file);

  if (!id || !product.title || !product.price || !product.image || !product.description) {
    return res.status(400).json({ message: "Complete product details are required" });
  }

  await db.query(
    "UPDATE products SET title = ?, brand = ?, price = ?, image = ?, description = ?, in_stock = ? WHERE id = ?",
    [product.title, product.brand, product.price, product.image, product.description, product.inStock, id],
  );

  const [rows] = await db.query(
    "SELECT id, title, brand, price, image, description, in_stock AS inStock FROM products WHERE id = ?",
    [id],
  );

  if (rows.length === 0) return res.status(404).json({ message: "Product not found" });
  res.json(rows[0]);
});

router.patch("/products/:id/stock", requireAdminPassword, async (req, res) => {
  const id = Number(req.params.id);
  const inStock = req.body.inStock === true || req.body.in_stock === true;

  if (!id) return res.status(400).json({ message: "Product id is required" });

  await db.query("UPDATE products SET in_stock = ? WHERE id = ?", [inStock, id]);
  const [rows] = await db.query(
    "SELECT id, title, brand, price, image, description, in_stock AS inStock FROM products WHERE id = ?",
    [id],
  );

  if (rows.length === 0) return res.status(404).json({ message: "Product not found" });
  res.json(rows[0]);
});

router.delete("/products/:id", requireAdminPassword, async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ message: "Product id is required" });

  const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);
  if (result.affectedRows === 0) return res.status(404).json({ message: "Product not found" });

  res.json({ message: "Product deleted" });
});

router.post("/seed", async (req, res) => {
  await seedDatabase();

  const [[{ count }]] = await db.query("SELECT COUNT(*) AS count FROM products");
  res.json({ message: "Default products checked in MySQL", count });
});

export default router;

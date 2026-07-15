import express from "express";
import { db } from "../db.js";

const router = express.Router();

router.post("/contact", async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim();
  const message = String(req.body.message || "").trim();

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email and message are required" });
  }

  const [result] = await db.query(
    "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)",
    [name, email, message],
  );

  res.status(201).json({
    id: result.insertId,
    name,
    email,
    message,
  });
});

export default router;

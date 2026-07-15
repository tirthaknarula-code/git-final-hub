import express from "express";
import { db } from "../db.js";

const router = express.Router();

router.post("/google-demo", async (req, res) => {
  const [result] = await db.query(
    "INSERT INTO users (name, email, provider) VALUES (?, ?, ?)",
    [
      req.body.name || "Google User",
      req.body.email || "student@example.com",
      "google-demo",
    ],
  );

  res.status(201).json({
    id: result.insertId,
    name: req.body.name || "Google User",
    email: req.body.email || "student@example.com",
    provider: "google-demo",
  });
});

export default router;

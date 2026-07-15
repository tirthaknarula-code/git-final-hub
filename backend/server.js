import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { db, dbName, initDatabase } from "./db.js";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";
import contactRoutes from "./routes/contact.js";
import ordersRoutes from "./routes/orders.js";
import paymentRoutes, { isRazorpayConfigured } from "./routes/payment.js";
import productsRoutes from "./routes/products.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({
      message: "Dukan backend running",
      database: dbName,
      databaseType: "MySQL",
      razorpayMode: isRazorpayConfigured ? "live/test key configured" : "demo mode",
    });
  } catch (error) {
    res.status(500).json({ message: "MySQL not connected", error: error.message });
  }
});

app.use("/api", productsRoutes);
app.use("/api", ordersRoutes);
app.use("/api", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/create-order", paymentRoutes);

async function start() {
  await initDatabase();

  app.listen(port, () => {
    console.log(`Backend API running on http://localhost:${port}`);
    console.log(`MySQL database connected: ${dbName}`);
  });
}

start().catch((error) => {
  console.error("Backend start failed:", error.message);
  console.error("Check MySQL server and backend/.env settings.");
});

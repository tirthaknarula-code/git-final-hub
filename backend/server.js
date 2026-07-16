import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { db, dbName, initDatabase } from "./db.js";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";
import contactRoutes from "./routes/contact.js";
import ordersRoutes from "./routes/orders.js";
import paymentRoutes, { isRazorpayReady } from "./routes/payment.js";
import productsRoutes from "./routes/products.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

let databaseReady = false;
let databaseError = "MySQL not checked yet";

app.get("/api/health", async (req, res) => {
  if (!databaseReady) {
    return res.status(503).json({
      message: "Backend running hai, par MySQL connected nahi hai.",
      database: dbName,
      databaseType: "MySQL",
      error: databaseError,
      razorpayMode: isRazorpayReady() ? "live/test key configured" : "not configured",
    });
  }

  try {
    await db.query("SELECT 1");
    res.json({
      message: "Dukan backend running",
      database: dbName,
      databaseType: "MySQL",
      razorpayMode: isRazorpayReady() ? "live/test key configured" : "not configured",
    });
  } catch (error) {
    databaseReady = false;
    databaseError = error.message;
    res.status(503).json({ message: "MySQL not connected", error: error.message });
  }
});

app.use((req, res, next) => {
  if (databaseReady) return next();

  res.status(503).json({
    message: "Backend running hai, par MySQL connected nahi hai.",
    error: databaseError,
  });
});

app.use("/api", productsRoutes);
app.use("/api", ordersRoutes);
app.use("/api", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/create-order", paymentRoutes);


async function start() {
  try {
    await initDatabase();
    databaseReady = true;
    databaseError = "";
    console.log(`MySQL database connected: ${dbName}`);
  } catch (error) {
    databaseReady = false;
    databaseError = error.message;
    console.error("MySQL connect nahi hua:", error.message);
    console.error("MySQL/XAMPP start karke backend terminal me Ctrl+C then npm run backend chalao.");
  }

  app.listen(port, () => {
    console.log(`Backend API running on http://localhost:${port}`);
  });
}

start();

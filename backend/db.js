import mysql from "mysql2/promise";

export const dbName = process.env.MYSQL_DATABASE || "dukan";
export let db;

export const seedProducts = [
  {
    title: "DOMS Fine Art Kit",
    brand: "DOMS",
    price: 499,
    image: "https://domsindia.com/wp-content/uploads/2025/06/FINE-ART.webp",
    description: "Premium art supplies inspired by DOMS fine art collection.",
  },
  {
    title: "DOMS Pencils & Accessories",
    brand: "DOMS",
    price: 120,
    image: "https://domsindia.com/wp-content/uploads/2025/06/1-1-scaled.webp",
    description: "Daily writing and drawing essentials for school work.",
  },
  {
    title: "DOMS Drawing Colours",
    brand: "DOMS",
    price: 260,
    image: "https://domsindia.com/wp-content/uploads/2025/06/2-1-scaled.webp",
    description: "Colouring products for charts, projects and creative files.",
  },
  {
    title: "Classmate Notebook Pack",
    brand: "Classmate",
    price: 240,
    image: "https://domsindia.com/wp-content/uploads/2025/06/4-scaled.webp",
    description: "Notebook bundle for notes, homework and project writing.",
  },
  {
    title: "Camlin Creative Combo",
    brand: "Camlin",
    price: 350,
    image: "https://domsindia.com/wp-content/uploads/2025/06/5-scaled.webp",
    description: "Creative stationery combo for school art and hobby work.",
  },
];

export function toOrder(row, items = []) {
  return {
    _id: row.id,
    id: row.id,
    items,
    total: Number(row.total),
    paymentMode: row.payment_mode,
    status: row.status,
    razorpayOrderId: row.razorpay_order_id,
    razorpayPaymentId: row.razorpay_payment_id,
    createdAt: row.created_at,
  };
}

export async function initDatabase() {
  const baseConfig = {
    host: process.env.MYSQL_HOST || "127.0.0.1",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true,
  };

  const setup = await mysql.createConnection(baseConfig);
  await setup.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  await setup.end();

  db = mysql.createPool({ ...baseConfig, database: dbName });
  await createTables();
  await seedDatabase();
}

async function createTables() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(160) NOT NULL,
      brand VARCHAR(80) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      image TEXT,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(160) NOT NULL,
      provider VARCHAR(60) NOT NULL DEFAULT 'google-demo',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      total DECIMAL(10, 2) NOT NULL,
      payment_mode VARCHAR(80) NOT NULL,
      status VARCHAR(80) NOT NULL DEFAULT 'pending-payment',
      razorpay_order_id VARCHAR(140),
      razorpay_payment_id VARCHAR(140),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_title VARCHAR(160) NOT NULL,
      brand VARCHAR(80),
      price DECIMAL(10, 2) NOT NULL DEFAULT 0,
      quantity INT NOT NULL DEFAULT 1,
      is_free BOOLEAN NOT NULL DEFAULT FALSE,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    )
  `);
}

export async function seedDatabase() {
  const [[{ count }]] = await db.query("SELECT COUNT(*) AS count FROM products");
  if (count > 0) return;

  await db.query(
    "INSERT INTO products (title, brand, price, image, description) VALUES ?",
    [
      seedProducts.map((product) => [
        product.title,
        product.brand,
        product.price,
        product.image,
        product.description,
      ]),
    ],
  );
}

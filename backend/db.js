import mysql from "mysql2/promise";

export const dbName = process.env.MYSQL_DATABASE || "dukan";
export let db;

export const seedProducts = [
  {
    id: "doms-fine-art",
    title: "Fine Art Kit",
    brand: "DOMS",
    price: 499,
    image: "https://domsindia.com/wp-content/uploads/2025/06/FINE-ART.webp",
    description: "Fine art set for painting, colouring and creative projects.",
  },
  {
    id: "doms-pencil-accessories",
    title: "Pencils & Accessories",
    brand: "DOMS",
    price: 120,
    image: "https://domsindia.com/wp-content/uploads/2025/06/1-1-scaled.webp",
    description: "DOMS pencils and school accessories for daily classwork.",
  },
  {
    id: "doms-drawing-colouring",
    title: "Drawing & Colouring Set",
    brand: "DOMS",
    price: 260,
    image: "https://domsindia.com/wp-content/uploads/2025/06/2-1-scaled.webp",
    description: "Colouring supplies for charts, diagrams and art files.",
  },
  {
    id: "doms-math-instruments",
    title: "Mathematical Drawing Instruments",
    brand: "DOMS",
    price: 180,
    image: "https://domsindia.com/wp-content/uploads/2025/06/3-scaled.webp",
    description: "Geometry and mathematical tools for school exams.",
  },
  {
    id: "doms-paper-stationery",
    title: "Paper Stationery Pack",
    brand: "DOMS",
    price: 240,
    image: "https://domsindia.com/wp-content/uploads/2025/06/4-scaled.webp",
    description: "DOMS paper stationery for notes, projects and assignments.",
  },
  {
    id: "doms-school-kit",
    title: "School Essentials Kit",
    brand: "DOMS",
    price: 350,
    image: "https://domsindia.com/wp-content/uploads/2025/06/5-scaled.webp",
    description: "Useful DOMS school kit with writing and colouring material.",
  },
  {
    id: "doms-notebooks",
    title: "Notebook & Paper Bundle",
    brand: "DOMS",
    price: 320,
    image: "https://domsindia.com/wp-content/uploads/2025/06/6-scaled.webp",
    description: "Paper and notebook bundle for homework and records.",
  },
  {
    id: "doms-brushes",
    title: "Brushes & Paint Set",
    brand: "DOMS",
    price: 285,
    image: "https://domsindia.com/wp-content/uploads/2025/06/7-scaled.webp",
    description: "Brushes and paint supplies for practical art classes.",
  },
  {
    id: "doms-pen-writing",
    title: "Pens & Writing Instruments",
    brand: "DOMS",
    price: 199,
    image: "https://domsindia.com/wp-content/uploads/2025/06/8-scaled.webp",
    description: "Pens and writing tools for school and office use.",
  },
  {
    id: "doms-project-file",
    title: "Project File Material",
    brand: "DOMS",
    price: 150,
    image: "https://domsindia.com/wp-content/uploads/2025/06/9-scaled.webp",
    description: "Sheets and project material for submissions and files.",
  },
  {
    id: "doms-markers",
    title: "Markers & Highlighters",
    brand: "DOMS",
    price: 175,
    image: "https://domsindia.com/wp-content/uploads/2025/06/2-1-scaled.webp",
    description: "Marker pens and highlighters for revision and presentation.",
  },
  {
    id: "doms-gifting",
    title: "Gifting Stationery Pack",
    brand: "DOMS",
    price: 449,
    image: "https://domsindia.com/wp-content/uploads/2025/06/FINE-ART.webp",
    description: "Gift-ready stationery pack for students and creative users.",
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
  await db.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(160) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function seedDatabase() {
  const currentTitles = seedProducts.map((product) => product.title);
  await db.query("DELETE FROM products WHERE title NOT IN (?)", [currentTitles]);

  for (const product of seedProducts) {
    await db.query(
      `UPDATE products
       SET brand = ?, price = ?, image = ?, description = ?
       WHERE title = ?`,
      [product.brand, product.price, product.image, product.description, product.title],
    );
  }

  const [existingRows] = await db.query("SELECT title FROM products");
  const existingTitles = new Set(existingRows.map((product) => product.title));
  const missingProducts = seedProducts.filter(
    (product) => !existingTitles.has(product.title),
  );

  if (missingProducts.length === 0) return;

  await db.query(
    "INSERT INTO products (title, brand, price, image, description) VALUES ?",
    [
      missingProducts.map((product) => [
        product.title,
        product.brand,
        product.price,
        product.image,
        product.description,
      ]),
    ],
  );
}

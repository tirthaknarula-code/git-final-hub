import mysql from "mysql2/promise";

export const dbName = process.env.MYSQL_DATABASE || "dukan";
export let db;

export const seedProducts = [
  {
    id: "doms-fine-art",
    title: "Fine Art Kit",
    brand: "DOMS",
    price: 499,
    image: "/images/products/doms-fine-art.webp",
    description: "Fine art set for painting, colouring and creative projects.",
  },
  {
    id: "doms-pencil-accessories",
    title: "Pencils & Accessories",
    brand: "DOMS",
    price: 120,
    image: "/images/products/doms-pencil-accessories.webp",
    description: "DOMS pencils and school accessories for daily classwork.",
  },
  {
    id: "doms-drawing-colouring",
    title: "Drawing & Colouring Set",
    brand: "DOMS",
    price: 260,
    image: "/images/products/doms-drawing-colouring.webp",
    description: "Colouring supplies for charts, diagrams and art files.",
  },
  {
    id: "doms-math-instruments",
    title: "Mathematical Drawing Instruments",
    brand: "DOMS",
    price: 180,
    image: "/images/products/doms-math-instruments.webp",
    description: "Geometry and mathematical tools for school exams.",
  },
  {
    id: "doms-paper-stationery",
    title: "Paper Stationery Pack",
    brand: "DOMS",
    price: 240,
    image: "/images/products/doms-paper-stationery.webp",
    description: "DOMS paper stationery for notes, projects and assignments.",
  },
  {
    id: "doms-school-kit",
    title: "School Essentials Kit",
    brand: "DOMS",
    price: 350,
    image: "/images/products/doms-school-kit.webp",
    description: "Useful DOMS school kit with writing and colouring material.",
  },
  {
    id: "doms-notebooks",
    title: "Notebook & Paper Bundle",
    brand: "DOMS",
    price: 320,
    image: "/images/products/doms-notebooks.webp",
    description: "Paper and notebook bundle for homework and records.",
  },
  {
    id: "doms-brushes",
    title: "Brushes & Paint Set",
    brand: "DOMS",
    price: 285,
    image: "/images/products/doms-brushes.webp",
    description: "Brushes and paint supplies for practical art classes.",
  },
  {
    id: "doms-pen-writing",
    title: "Pens & Writing Instruments",
    brand: "DOMS",
    price: 199,
    image: "/images/products/doms-pens-writing.webp",
    description: "Pens and writing tools for school and office use.",
  },
  {
    id: "doms-project-file",
    title: "Project File Material",
    brand: "DOMS",
    price: 150,
    image: "/images/products/doms-project-file.webp",
    description: "Sheets and project material for submissions and files.",
  },
  {
    id: "doms-markers",
    title: "Markers & Highlighters",
    brand: "DOMS",
    price: 175,
    image: "/images/products/doms-drawing-colouring.webp",
    description: "Marker pens and highlighters for revision and presentation.",
  },
  {
    id: "doms-gifting",
    title: "Gifting Stationery Pack",
    brand: "DOMS",
    price: 449,
    image: "/images/products/doms-fine-art.webp",
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

  let setup;

  try {
    setup = await mysql.createConnection(baseConfig);
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      throw new Error("MySQL start nahi hai. Pehle MySQL/XAMPP start karo, phir backend refresh karo.");
    }
    throw error;
  }

  await setup.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  await setup.end();

  db = mysql.createPool({ ...baseConfig, database: dbName });
  await createTables();
  await seedDatabase();
}

async function addColumnIfMissing(table, column, definition) {
  try {
    await db.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  } catch (error) {
    if (error.code !== "ER_DUP_FIELDNAME") throw error;
  }
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
      in_stock BOOLEAN NOT NULL DEFAULT TRUE,
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
  try {
    await db.query("ALTER TABLE products ADD COLUMN in_stock BOOLEAN NOT NULL DEFAULT TRUE");
  } catch (error) {
    if (error.code !== "ER_DUP_FIELDNAME") throw error;
  }

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


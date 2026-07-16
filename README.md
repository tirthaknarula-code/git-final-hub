# Dukan - Stationery Hub Ecommerce

Stationery Hub is a React frontend with a separate Express backend. Data is stored in MySQL, Razorpay handles checkout orders, and the password-protected admin panel shows products, orders, users, sales and sold item counts in table format.

## Folder Structure

```text
project/
  frontend/             React + Vite website
  backend/              Express backend app
    routes/             All API route files
    middleware/         Admin password protection
    db.js               MySQL connection, tables and seed data
    server.js           Backend start file
```

## MySQL Setup

Start MySQL from XAMPP, MySQL Workbench or MySQL Server.

Default backend settings:

```env
PORT=3001
MYSQL_HOST=127.0.0.1
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=dukan
ADMIN_PASSWORD=change-this-admin-password
```

If your MySQL password is different, update `backend/.env`.

The backend creates the database and tables automatically. A manual schema is also available at:

```text
backend/schema.sql
```

## Run Backend

Open one terminal:

```bash
npm run backend
```

Backend URL:

```text
http://localhost:3001
```

## Run Frontend

Open a second terminal:

```bash
npm run frontend
```

Frontend URL:

```text
http://localhost:5173
```

## Main APIs

- `GET /api/health`
- `GET /api/products`
- `POST /api/orders`
- `PATCH /api/orders/:id`
- `POST /create-order`
- `GET /api/admin/summary`
- `GET /api/admin/products`
- `GET /api/admin/orders`
- `GET /api/admin/users`

Admin APIs require the `x-admin-password` header.

## Admin Panel

Open the website and click `admin`, then enter the admin password.

Admin panel shows total orders, total sales, sold items, users, product sold table, order table and user table.

## Auto MySQL Start

On Windows, `npm run backend` now tries to start local MySQL automatically if port `3306` is closed. It checks common MySQL and XAMPP paths.

If MySQL is installed somewhere else, set these in `backend/.env`:

```env
MYSQL_PORT=3306
MYSQLD_PATH=C:\path\to\mysqld.exe
MYSQL_DATA_DIR=C:\path\to\mysql\data
```

Admin-added products are preserved after backend restart.
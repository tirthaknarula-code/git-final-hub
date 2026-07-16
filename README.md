# Stationery Hub Ecommerce

React frontend, Express backend, MySQL database, admin panel, local product image uploads and Razorpay checkout.

## Folder Structure

```text
project/
  frontend/              React website
  backend/               Express + MySQL backend
    images/products/     Downloaded and uploaded product images
    routes/              API routes
    db.js                MySQL tables and seed products
```

## Run Website

Open terminal in project folder and run:

```powershell
npm start
```

Then open:

```text
http://127.0.0.1:5173
```

`npm start` runs backend and frontend together.

## MySQL

Start MySQL first from MySQL/XAMPP if it is not already running.

Backend health check:

```text
http://127.0.0.1:3001/api/health
```

## Admin

Only selected Google emails can see the Admin tab. Admin can add, edit, delete and mark products out of stock.

Uploaded product images are saved in:

```text
backend/images/products/
```

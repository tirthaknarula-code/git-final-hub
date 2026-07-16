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
  start-website.bat      One-click website start
```

## Easiest Run

Double click:

```text
start-website.bat
```

Then open:

```text
http://127.0.0.1:5173
```

## Terminal Run

```powershell
cd C:\Users\tirth\OneDrive\Attachments\Desktop\project
npm start
```

`npm start` runs backend and frontend together.

## MySQL

The project uses local MySQL database `dukan`. If MySQL does not start automatically, run `start-mysql-admin.bat` as administrator once, then run `npm start`.

Backend health check:

```text
http://127.0.0.1:3001/api/health
```

## Admin

Only selected Google emails can see the Admin tab. Admin can add, edit, delete and mark products out of stock. Uploaded product images are saved in:

```text
backend/images/products/
```

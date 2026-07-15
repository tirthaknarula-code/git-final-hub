export function requireAdminPassword(req, res, next) {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const givenPassword = req.headers["x-admin-password"] || req.query.adminPassword;

  if (!expectedPassword || givenPassword !== expectedPassword) {
    return res.status(401).json({ message: "Admin password required" });
  }

  next();
}
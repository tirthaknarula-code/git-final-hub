const defaultAdminEmails = ["tirthaknarula@gmail.com", "sanyamsharma261@gmail.com"];

function getAllowedAdminEmails() {
  const envEmails = process.env.ADMIN_EMAILS || defaultAdminEmails.join(",");
  return envEmails
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function requireAdminPassword(req, res, next) {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const givenPassword = req.headers["x-admin-password"] || req.query.adminPassword;
  const givenEmail = String(req.headers["x-admin-email"] || req.query.adminEmail || "")
    .trim()
    .toLowerCase();

  if (!givenEmail || !getAllowedAdminEmails().includes(givenEmail)) {
    return res.status(403).json({ message: "This email is not allowed for admin" });
  }

  if (!expectedPassword || givenPassword !== expectedPassword) {
    return res.status(401).json({ message: "Admin password required" });
  }

  next();
}
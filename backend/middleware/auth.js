import jwt from "jsonwebtoken";
export function auth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No token provided" });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { return res.status(401).json({ error: "Invalid token" }); }
}
export function requireSenior(req, res, next) {
  if (req.user?.role === "senior") return next();
  return res.status(403).json({ error: "Senior role required" });
}

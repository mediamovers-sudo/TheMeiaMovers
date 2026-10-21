const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

const requireAdmin = (req, res, next) => {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      token = parts[1];
    }
  }

  if (!token) {
    console.warn(`[Auth Warning] Unauthorized ${req.method} ${req.originalUrl} — no cookie or Bearer token provided.`);
    return res.status(401).json({
      error: 'Unauthorized: Administrative session cookie or authorization header missing.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    console.warn(`[Auth Warning] Unauthorized ${req.method} ${req.originalUrl} — invalid/expired token: ${err.message}`);
    return res.status(401).json({
      error: 'Unauthorized: Session token is expired or invalid.'
    });
  }
};

module.exports = {
  requireAdmin
};

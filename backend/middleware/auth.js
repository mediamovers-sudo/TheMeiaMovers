const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

const requireAdmin = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized: Administrative session cookie missing.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Unauthorized: Session token is expired or invalid.'
    });
  }
};

module.exports = {
  requireAdmin
};

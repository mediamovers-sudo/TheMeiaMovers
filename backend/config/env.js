const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mediamovers?schema=public',
  JWT_SECRET: process.env.JWT_SECRET || 'mediamovers_production_jwt_secret_key_2026',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@mediamovers.nist.edu',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'AdminPassword2026!',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
};

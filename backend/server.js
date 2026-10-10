const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');

const { PORT, NODE_ENV, FRONTEND_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = require('./config/env');
const prisma = require('./models/prisma');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const memberRoutes = require('./routes/memberRoutes');
const workItemRoutes = require('./routes/workItemRoutes');
const wirePhotoRoutes = require('./routes/wirePhotoRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// 1. Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows CDN scripts (Tailwind, Google Fonts) when serving frontend
    crossOriginEmbedderPolicy: false
  })
);

// 2. CORS - strictly locked to frontend origins with credentials allowed
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost:5000',
  'http://127.0.0.1:5000'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, or same-origin)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy rejection: Origin ${origin} not permitted.`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// 3. Body Parsing & Cookie Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 4. Static Uploads Folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 5. Mount API Routes
// Prevent caching for API GET requests
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/work-items', workItemRoutes);
app.use('/api/wire-photos', wirePhotoRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/upload', uploadRoutes);

// 6. Serve Frontend Statically — same origin as API, no CORS needed
const frontendPath = path.join(__dirname, '../frontend');
console.log(`[Static] Serving frontend from: ${frontendPath}`);
// Use no-cache for static files (especially HTML)
app.use(express.static(frontendPath, {
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// 7. Centralized Error Handler
app.use(errorHandler);

// Helper: Ensure initial admin user exists from environment variables on startup
async function ensureAdminUser() {
  try {
    const adminCount = await prisma.adminUser.count();
    if (adminCount === 0 && ADMIN_EMAIL && ADMIN_PASSWORD) {
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
      await prisma.adminUser.create({
        data: {
          email: ADMIN_EMAIL.toLowerCase().trim(),
          passwordHash
        }
      });
      console.log(`[Auth] Seeded initial admin account: ${ADMIN_EMAIL}`);
    } else if (adminCount > 0) {
      console.log(`[Auth] Admin account exists (${adminCount} admin user(s) in DB).`);
    }
  } catch (err) {
    console.warn('[DB] Notice: Could not verify admin user on startup:', err.message);
  }
}

// Start Server — bind to 0.0.0.0 so it's reachable on localhost
const HOST = '0.0.0.0';
const server = app.listen(PORT, HOST, async () => {
  console.log(`====================================================`);
  console.log(` MediaMovers REST API — ${NODE_ENV} mode`);
  console.log(` Listening on: http://${HOST}:${PORT}`);
  console.log(``);
  console.log(` Public site:  http://localhost:${PORT}/`);
  console.log(` Admin panel:  http://localhost:${PORT}/admin.html`);
  console.log(` API health:   http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
  await ensureAdminUser();
});

module.exports = { app, server };


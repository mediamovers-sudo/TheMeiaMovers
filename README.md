# The MediaMovers — Full-Stack Web Application

> NIST PR Cell creative collective website with client/server architecture.

## Architecture

```
mediamovers/web/
├── frontend/               # Static public site + admin dashboard
│   ├── index.html          # PUBLIC site (zero admin/auth code)
│   ├── admin.html          # ADMIN dashboard (direct URL access only)
│   ├── IMG-20250221-WA0014.jpg  # Logo
│   ├── member/             # Member photos
│   └── team/               # Team photos
│
├── backend/                # Node.js + Express REST API
│   ├── server.js           # Express app entry point (port 5000)
│   ├── package.json
│   ├── .env                # Environment variables (gitignore this)
│   ├── .env.example        # Template for .env
│   ├── config/
│   │   └── env.js          # Environment config loader
│   ├── prisma/
│   │   ├── schema.prisma   # Prisma schema (SQLite default)
│   │   ├── schema.sqlite.prisma  # SQLite reference schema
│   │   ├── seed.js         # Database seeder
│   │   └── dev.db          # SQLite database file (auto-created)
│   ├── models/
│   │   └── prisma.js       # Prisma client singleton
│   ├── middleware/
│   │   ├── auth.js         # requireAdmin JWT cookie middleware
│   │   ├── rateLimiter.js  # Login + public form rate limiters
│   │   └── errorHandler.js # Centralized error handler
│   ├── controllers/        # Business logic
│   │   ├── authController.js
│   │   ├── memberController.js
│   │   ├── workItemController.js
│   │   ├── wirePhotoController.js
│   │   ├── applicationController.js
│   │   └── uploadController.js
│   ├── routes/             # Express routers
│   │   ├── authRoutes.js
│   │   ├── memberRoutes.js
│   │   ├── workItemRoutes.js
│   │   ├── wirePhotoRoutes.js
│   │   ├── applicationRoutes.js
│   │   └── uploadRoutes.js
│   └── uploads/            # Uploaded images via multer
│
└── code.html               # Original single-file source (preserved)
```

## Quick Start (Zero-Dependency Local Setup)

### Prerequisites
- **Node.js** v18+ (tested on v24.19.0)
- No PostgreSQL needed — uses SQLite by default

### Setup

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Configure environment variables
# Copy .env.example to .env and set your DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, etc.
cp .env.example .env

# 3. Generate Prisma client & apply schema to database
npm run build

# 4. Start the server
npm start
```

### Access

| URL | Description |
|-----|-------------|
| `http://localhost:5000` | Public website (index.html) |
| `http://localhost:5000/admin.html` | Admin dashboard (direct URL only) |
| `http://localhost:5000/api/health` | API health check |

### Admin Credentials
Admin user credentials are created on server startup from the `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables if no admin user exists in the database. Never commit credentials to version control.

## Page Separation

- **`index.html`** — Public-facing site. Contains zero admin UI, zero login forms, zero auth code, and no visible links to `admin.html`. Visitors cannot discover the admin page exists.
- **`admin.html`** — Standalone admin dashboard accessible only by navigating directly to `/admin.html`. Contains login form, session management, and full CMS.
- These two pages do **not** link to each other.

## API Endpoints

### Public (No Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/members` | List all members |
| GET | `/api/work-items` | List all work items |
| GET | `/api/wire-photos` | List all wire photos |
| POST | `/api/applications` | Submit crew application |

### Admin (Requires JWT Cookie)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login (sets httpOnly cookie) |
| POST | `/api/auth/logout` | Logout (clears cookie) |
| GET | `/api/auth/me` | Check session |
| POST | `/api/members` | Create member |
| PUT | `/api/members/:id` | Update member |
| DELETE | `/api/members/:id` | Delete member |
| POST | `/api/work-items` | Create work item |
| PUT | `/api/work-items/:id` | Update work item |
| DELETE | `/api/work-items/:id` | Delete work item |
| POST | `/api/wire-photos` | Create wire photo |
| PUT | `/api/wire-photos/:id` | Update wire photo |
| DELETE | `/api/wire-photos/:id` | Delete wire photo |
| GET | `/api/applications` | List applications |
| PATCH | `/api/applications/:id` | Update app status |
| POST | `/api/upload` | Upload image (multipart) |

## Security

- **JWT** stored in `httpOnly`, `sameSite`, `secure` cookie — never in localStorage
- **bcryptjs** password hashing (12 rounds)
- **helmet()** security headers
- **CORS** with credentials restricted to allowed origins
- **express-rate-limit** on login (10 per 15 min) and public forms
- **No client-side DB SDK** — browser only talks to Express API

## Database & Deployment

- **Database:** PostgreSQL (Supabase / Neon / Render Postgres)
- **Image Storage:** Cloudinary
- **Deployment:** Render (Single Web Service serving both Express backend and frontend static assets)

### Render Settings
- **Root Directory:** `backend`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

## Data Models

- **Member** — name, role, department, quote, bio, photoUrl, instagramHandle, sortOrder
- **WorkItem** — title, thumbnailUrl, category, videoUrl, description, sortOrder
- **WirePhoto** — imageUrl, title, description, reelTag, sortOrder
- **Application** — name, email, department, portfolioLink, message, status
- **AdminUser** — email, passwordHash

## What Changed from code.html

The original `code.html` (2439 lines) was split into:

1. **`frontend/index.html`** — Full copy of code.html with:
   - Logo path fixed from absolute `D:\mediamovers\web\...` to relative
   - Apply form wired to `POST /api/applications` instead of `alert()`
   - Dynamic API hydration added: `fetch('/api/members')`, `fetch('/api/work-items')`, `fetch('/api/wire-photos')` on page load, re-rendering grids with API data while keeping hardcoded fallback data
   - All existing styling, animations, routing, modals, fonts preserved exactly

2. **`frontend/admin.html`** — Brand-new standalone page with:
   - Same brand colors (#3B499B, #FF5E1E, #0B1220)
   - Same fonts (JetBrains Mono, Anton, Outfit)
   - Login → session check → tabbed dashboard (Members, Work Items, Wire Photos, Applications)
   - Full CRUD modals with image upload support

3. **`backend/`** — Complete Express REST API with Prisma ORM, all routes/controllers matching the data models

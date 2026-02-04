# 🌟 Testimonial System - Professional Invite-Only Client Reviews

<div align="center">

![Futuristic Design](https://img.shields.io/badge/Design-Futuristic-00f0ff?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**A modern, secure testimonial management system with a stunning cyberpunk-inspired UI**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Documentation](#-documentation) • [Deployment](#-deployment) • [Contributing](#-contributing)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Architecture](#-architecture)
- [Security](#-security)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 🎯 Overview

**Testimonial System** adalah aplikasi manajemen testimoni modern yang dirancang untuk profesional dan bisnis yang ingin mengumpulkan ulasan autentik dari klien mereka. Sistem ini menggunakan mekanisme **invite-only** dengan token unik untuk memastikan setiap testimoni berasal dari klien yang terverifikasi.

### Why This Project?

- ✅ **100% Authentic** - Sistem token mencegah review palsu
- 🎨 **Modern UI/UX** - Desain cyberpunk futuristik yang eye-catching
- 🔒 **Secure** - JWT authentication & password hashing
- 📱 **Responsive** - Perfect di semua device
- ⚡ **Fast** - Built with modern tech stack
- 🌐 **Production Ready** - Siap deploy ke berbagai platform

---

## ✨ Features

### 🔐 Invite-Only Token System
- **Unique VIP Links** - Setiap klien mendapat link undangan unik
- **One-Time Use** - Token hanya bisa digunakan sekali untuk mencegah penyalahgunaan
- **Configurable Expiration** - Atur masa berlaku token dari 1 jam hingga 30 hari
- **Status Tracking** - Monitor token (active, used, expired, revoked)
- **WhatsApp Integration** - Share link langsung via WhatsApp

### 🎨 Modern Futuristic Design
- **Cyberpunk UI** - Neon colors, glassmorphism, animated backgrounds
- **Smooth Animations** - Powered by Framer Motion
- **Dark/Light Mode** - Theme switcher dengan system preference support
- **Fully Responsive** - Mobile-first approach
- **Custom Components** - Reusable UI components

### 📊 Admin Dashboard
- **Project Management** - CRUD operations untuk projects
- **Token Generation** - Generate & manage invite links
- **Testimonial Moderation** - Feature, publish/unpublish, delete
- **Statistics** - Real-time metrics & analytics
- **Search & Filter** - Advanced filtering system
- **Pagination** - Efficient data loading

### 🌐 Public Display
- **Testimonial Showcase** - Beautiful card-based layout
- **Search & Filter** - Find reviews by rating, name, or content
- **Featured Testimonials** - Highlight your best reviews
- **Star Ratings** - Visual 5-star rating system
- **SEO Friendly** - Optimized for search engines

### 🔒 Security Features
- **JWT Authentication** - Secure admin access
- **Password Hashing** - bcrypt encryption
- **Token Expiration** - Automatic invalidation
- **One-Time Use Tokens** - Prevent reuse
- **CORS Configuration** - Protected API endpoints
- **Input Validation** - Pydantic models

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS with custom cyberpunk theme
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Date Handling:** date-fns

### Backend
- **Framework:** FastAPI (Python 3.9+)
- **Database:** MongoDB with Motor (async driver)
- **Authentication:** JWT (python-jose)
- **Password Hashing:** bcrypt via passlib
- **Validation:** Pydantic v2
- **CORS:** FastAPI middleware
- **Server:** Uvicorn (ASGI)

### DevOps & Deployment
- **Frontend:** Vercel / Netlify / Render
- **Backend:** Render / Railway / Fly.io
- **Database:** MongoDB Atlas
- **Version Control:** Git & GitHub

---

## 📁 Project Structure

```
testimonial-system/
├── frontend/                      # React Frontend Application
│   ├── public/
│   │   └── _redirects            # SPA routing for deployment
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── layouts/          # Page layouts (AdminLayout, PublicLayout)
│   │   │   └── ui/               # UI elements (Modal, StarRating, etc.)
│   │   ├── pages/                # Page components
│   │   │   ├── admin/            # Admin pages (Dashboard, Projects, etc.)
│   │   │   └── public/           # Public pages (Home, Testimonials, etc.)
│   │   ├── context/              # State management (Zustand stores)
│   │   ├── utils/                # Utilities & API client
│   │   ├── styles/               # Global styles & Tailwind config
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # Entry point
│   ├── .env.example              # Environment variables template
│   ├── package.json              # Dependencies & scripts
│   ├── tailwind.config.js        # Tailwind configuration
│   └── vite.config.js            # Vite configuration
│
└── backend/                       # FastAPI Backend Application
    ├── app/
    │   ├── core/                 # Core utilities
    │   │   ├── database.py       # MongoDB connection & indexes
    │   │   └── security.py       # Auth, JWT, password hashing
    │   ├── routes/               # API endpoints
    │   │   ├── admin.py          # Admin authentication & management
    │   │   ├── tokens.py         # Token generation & validation
    │   │   ├── testimonials.py   # Testimonial CRUD operations
    │   │   └── public.py         # Public endpoints (no auth)
    │   ├── schemas/              # Pydantic models
    │   │   └── schemas.py        # Data validation schemas
    │   └── main.py               # FastAPI app entry point
    ├── requirements.txt          # Python dependencies
    └── main.py                   # Server entry point for deployment
```

---

## 🚀 Getting Started

### Prerequisites

Pastikan Anda telah menginstall:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.9+ ([Download](https://www.python.org/))
- **MongoDB Atlas** account ([Sign up](https://www.mongodb.com/cloud/atlas))
- **Git** ([Download](https://git-scm.com/))

### Backend Setup

1. **Clone repository**
   ```bash
   git clone https://github.com/yourusername/testimonial-system.git
   cd testimonial-system/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Mac/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   
   Create `.env` file in `backend/` directory:
   ```env
   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
   DATABASE_NAME=testimonial_system
   SECRET_KEY=your-super-secret-key-change-in-production-min-32-chars
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   FRONTEND_URL=http://localhost:5173
   ```

5. **Run the server**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

   Server akan berjalan di: `http://localhost:8000`
   
   API Documentation: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create `.env` file in `frontend/` directory:
   ```env
   # For local development (uses proxy)
   VITE_API_URL=/api
   
   # For production
   # VITE_API_URL=https://your-backend.onrender.com/api
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   App akan berjalan di: `http://localhost:5173`

### 🎉 First Time Setup

1. Buka `http://localhost:5173`
2. Navigate to `/admin/register`
3. Create your admin account
4. Login dengan credentials yang baru dibuat
5. Create your first project
6. Generate invite token
7. Share link ke klien Anda!

---

## 🔑 Environment Variables

### Backend (.env)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MONGODB_URL` | MongoDB connection string | - | ✅ Yes |
| `DATABASE_NAME` | Database name | `testimonial_system` | No |
| `SECRET_KEY` | JWT secret key (min 32 chars) | - | ✅ Yes |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT expiration time | `1440` (24 hours) | No |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` | No |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `/api` (dev) or `https://api.example.com/api` (prod) |

**Important Notes:**
- Generate secure `SECRET_KEY`: `openssl rand -hex 32`
- Never commit `.env` files to version control
- Use `.env.example` as template

---

## 📚 API Documentation

### Authentication Endpoints

#### Register Admin
```http
POST /api/admin/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@example.com",
  "password": "securepassword",
  "full_name": "Admin Name"
}
```

#### Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "securepassword"
}
```

### Project Endpoints

#### Create Project
```http
POST /api/admin/projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "E-Commerce Website",
  "description": "Full-stack e-commerce platform",
  "client_name": "John Doe",
  "client_email": "john@example.com",
  "client_company": "ABC Corp",
  "project_url": "https://example.com",
  "tags": ["web", "e-commerce", "react"],
  "status": "active"
}
```

#### Get All Projects
```http
GET /api/admin/projects
Authorization: Bearer {token}
```

### Token Endpoints

#### Generate Invite Token
```http
POST /api/tokens/generate
Authorization: Bearer {token}
Content-Type: application/json

{
  "project_id": "60d5ec49f1b2c8b1f8c4e2a1",
  "expires_hours": 72,
  "note": "Sent via WhatsApp"
}
```

#### Validate Token (Public)
```http
GET /api/tokens/validate/{token}
```

### Testimonial Endpoints

#### Submit Testimonial (Public)
```http
POST /api/testimonials/submit
Content-Type: application/json

{
  "token": "abc123-xyz789-def456",
  "client_name": "Jane Smith",
  "client_role": "CEO",
  "client_company": "XYZ Inc",
  "rating": 5,
  "title": "Excellent Service!",
  "content": "Working with this team was amazing..."
}
```

#### Get Public Testimonials
```http
GET /api/public/testimonials
```

### Complete API Documentation

Visit `http://localhost:8000/docs` when backend is running untuk interactive API documentation (Swagger UI).

---

## 🏗 Architecture

### System Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│  React Frontend │◄───────►│  FastAPI Backend │◄───────►│  MongoDB Atlas  │
│   (Vite + TS)   │  HTTP   │   (Python 3.9+)  │  Motor  │   (Database)    │
│                 │         │                  │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
        │                            │
        │                            │
        ▼                            ▼
┌─────────────────┐         ┌──────────────────┐
│  Vercel/Netlify │         │  Render/Railway  │
│   (Frontend)    │         │    (Backend)     │
└─────────────────┘         └──────────────────┘
```

### Database Schema

#### Collections

**admins**
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password_hash: String,
  full_name: String,
  created_at: DateTime,
  updated_at: DateTime
}
```

**projects**
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  client_name: String,
  client_email: String,
  client_company: String,
  project_url: String,
  project_image: String,
  tags: [String],
  status: String (active/completed/archived),
  admin_id: String,
  created_at: DateTime,
  updated_at: DateTime
}
```

**tokens**
```javascript
{
  _id: ObjectId,
  token: String (unique),
  project_id: String,
  status: String (active/used/expired/revoked),
  created_at: DateTime,
  expires_at: DateTime,
  used_at: DateTime,
  note: String,
  created_by: String
}
```

**testimonials**
```javascript
{
  _id: ObjectId,
  project_id: String,
  token_id: String,
  client_name: String,
  client_role: String,
  client_company: String,
  client_avatar: String,
  rating: Integer (1-5),
  title: String,
  content: String,
  is_featured: Boolean,
  is_published: Boolean,
  created_at: DateTime,
  updated_at: DateTime
}
```

### Data Flow

#### Invite Flow
```
Admin → Create Project → Generate Token → Share Link → Client → Submit Testimonial → Dashboard
```

1. Admin creates project in dashboard
2. Admin generates invite token with expiration
3. Admin shares unique URL to client
4. Client opens link and validates token
5. Client fills testimonial form
6. Token is marked as "used"
7. Testimonial appears in admin dashboard

---

## 🔒 Security

### Implemented Security Measures

1. **Authentication & Authorization**
   - JWT token-based authentication
   - Password hashing with bcrypt (cost factor: 12)
   - Token expiration handling
   - Automatic logout on token expiry

2. **API Security**
   - CORS configuration
   - Request validation with Pydantic
   - SQL injection prevention (NoSQL database)
   - Rate limiting ready (can be implemented)

3. **Input Validation**
   - Frontend form validation
   - Backend Pydantic models
   - Sanitization of user inputs
   - File type restrictions

4. **Token Security**
   - Cryptographically secure token generation
   - One-time use tokens
   - Expiration dates
   - Status tracking (active/used/expired/revoked)

### Security Best Practices

✅ **DO:**
- Use strong SECRET_KEY (min 32 characters)
- Enable HTTPS in production
- Keep dependencies updated
- Use environment variables for secrets
- Implement rate limiting in production
- Regular security audits

❌ **DON'T:**
- Commit `.env` files
- Use default SECRET_KEY
- Expose sensitive data in responses
- Store passwords in plain text
- Disable CORS in production

---

## 🚢 Deployment

### Frontend Deployment

#### Option 1: Vercel (Recommended)

1. **Connect GitHub Repository**
   ```bash
   # Push to GitHub
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Set build settings:
     - **Framework Preset:** Vite
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
     - **Install Command:** `npm install`

3. **Configure Environment Variables**
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

4. **Deploy!**

#### Option 2: Netlify

1. **Create `netlify.toml`** (already included)

2. **Deploy**
   ```bash
   npm run build
   # Drag & drop 'dist' folder to Netlify
   ```

3. **Or use Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

### Backend Deployment

#### Option 1: Render (Recommended)

1. **Create New Web Service**
   - Go to [render.com](https://render.com)
   - New → Web Service
   - Connect GitHub repository

2. **Configure Service**
   - **Name:** testimonial-backend
   - **Root Directory:** `backend`
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Add Environment Variables**
   ```
   MONGODB_URL=mongodb+srv://...
   SECRET_KEY=your-secret-key
   DATABASE_NAME=testimonial_system
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

4. **Deploy!**

#### Option 2: Railway

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login & Deploy**
   ```bash
   railway login
   cd backend
   railway init
   railway up
   ```

3. **Add Environment Variables** via Railway dashboard

### MongoDB Atlas Setup

1. **Create Cluster**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create free cluster (M0)

2. **Create Database User**
   - Database Access → Add New User
   - Set username & password

3. **Whitelist IP**
   - Network Access → Add IP Address
   - Add `0.0.0.0/0` (allow all) for development

4. **Get Connection String**
   - Clusters → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your password

### Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and API responding
- [ ] MongoDB Atlas connected
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] HTTPS enabled
- [ ] Custom domain configured (optional)
- [ ] Admin account created
- [ ] Test testimonial submission flow
- [ ] Monitor logs for errors

---

## 📸 Screenshots

### Homepage
![Homepage](https://via.placeholder.com/800x400/0a0a0c/00f0ff?text=Homepage+Screenshot)
*Modern landing page dengan cyberpunk aesthetic*

### Admin Dashboard
![Dashboard](https://via.placeholder.com/800x400/0a0a0c/9d00ff?text=Admin+Dashboard)
*Real-time statistics dan quick actions*

### Project Management
![Projects](https://via.placeholder.com/800x400/0a0a0c/00f0ff?text=Project+Management)
*CRUD operations dengan beautiful cards*

### Token Generation
![Tokens](https://via.placeholder.com/800x400/0a0a0c/ff00aa?text=Token+Generation)
*Generate & track invite links*

### Testimonial Form
![Form](https://via.placeholder.com/800x400/0a0a0c/00ff88?text=Testimonial+Form)
*Client-facing testimonial submission form*

### Public Testimonials
![Public](https://via.placeholder.com/800x400/0a0a0c/ffee00?text=Public+Testimonials)
*Showcase your best reviews*

---

## 🎨 Customization

### Theme Customization

Edit `frontend/tailwind.config.js`:

```javascript
colors: {
  neon: {
    cyan: '#00f0ff',      // Change primary color
    purple: '#9d00ff',    // Change secondary color
    magenta: '#ff00aa',   // Change accent color
    // Add your custom colors
  }
}
```

### Fonts

Current fonts (Google Fonts):
- **Orbitron** - Display/headings (futuristic)
- **Rajdhani** - Body text
- **JetBrains Mono** - Code/monospace

Change in `frontend/index.html` and `tailwind.config.js`.

### Logo

Replace logo component in `frontend/src/components/layouts/`.

---

## 🐛 Troubleshooting

### Common Issues

#### Frontend can't connect to backend

**Problem:** CORS errors or network errors

**Solution:**
```javascript
// frontend/vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
```

#### MongoDB connection failed

**Problem:** Can't connect to MongoDB Atlas

**Solution:**
1. Check MONGODB_URL format
2. Whitelist your IP in Atlas
3. Verify database user credentials
4. Check network connectivity

#### JWT token expired

**Problem:** Auto-logout after some time

**Solution:**
- Increase `ACCESS_TOKEN_EXPIRE_MINUTES` in backend `.env`
- Or implement refresh token mechanism

#### Build errors

**Problem:** `npm run build` fails

**Solution:**
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check Node version
node -v  # Should be 18+
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### How to Contribute

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/testimonial-system.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable

4. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Describe your changes
   - Reference any related issues

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint rules for JavaScript/React
- Write meaningful commit messages
- Update documentation
- Test your changes

### Code of Conduct

Be respectful, inclusive, and constructive. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Bill Van Ricardo Zalukhu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙏 Acknowledgments

### Built With
- [React](https://reactjs.org/) - UI library
- [FastAPI](https://fastapi.tiangolo.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide Icons](https://lucide.dev/) - Icon set

### Inspiration
- Cyberpunk aesthetics
- Modern dashboard designs
- User-first approach

### Special Thanks
- Open source community
- FastAPI & React communities
- All contributors

---

## 📞 Support

### Get Help

- 📧 **Email:** support@example.com
- 💬 **Discord:** [Join our server](https://discord.gg/example)
- 📖 **Documentation:** [Full docs](https://docs.example.com)
- 🐛 **Issues:** [GitHub Issues](https://github.com/yourusername/testimonial-system/issues)

### Roadmap

- [ ] Email notifications
- [ ] Multiple languages (i18n)
- [ ] Advanced analytics
- [ ] CSV export
- [ ] API rate limiting
- [ ] Real-time updates with WebSocket
- [ ] Mobile app (React Native)
- [ ] Integration with CRM platforms

---

## ⭐ Star History

If you find this project helpful, please consider giving it a star!

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/testimonial-system&type=Date)](https://star-history.com/#yourusername/testimonial-system&Date)

---

<div align="center">

**Built with ❤️ for professional testimonial collection**

Made by [Bill Van Ricardo Zalukhu](https://github.com/yourusername)

[⬆ Back to Top](#-testimonial-system---professional-invite-only-client-reviews)

</div>
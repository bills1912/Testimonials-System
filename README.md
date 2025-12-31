# 🌟 Testimonial System - Professional Invite-Only Client Reviews

A modern, futuristic testimonial management system with an elegant invite-only token system. Built with React.js (Frontend) and FastAPI (Backend) with MongoDB database.

![Futuristic Design](https://img.shields.io/badge/Design-Futuristic-00f0ff)
![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248)

## ✨ Features

### 🔐 Invite-Only Token System
- **No client login required** - Clients receive unique VIP links
- **One-time use tokens** - Prevents abuse and ensures authenticity
- **Configurable expiration** - Set token validity from 1 hour to 30 days
- **Token tracking** - Monitor status (active, used, expired, revoked)

### 🎨 Modern Futuristic Design
- **Cyberpunk-inspired UI** - Neon colors, glassmorphism, and grid patterns
- **Smooth animations** - Powered by Framer Motion
- **Fully responsive** - Works on all devices
- **Dark theme** - Easy on the eyes

### 📊 Admin Dashboard
- **Project management** - Create, edit, and organize projects
- **Token generation** - Generate and share invite links
- **Testimonial moderation** - Feature, publish/unpublish, delete reviews
- **Statistics** - Track total reviews, average ratings, and more

### 🌐 Public Display
- **Beautiful testimonial showcase** - Display reviews elegantly
- **Search & filter** - Find testimonials by rating, name, or content
- **Featured testimonials** - Highlight your best reviews

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.9+
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📁 Project Structure

```
testimonial-system/
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── layouts/      # Page layouts
│   │   │   └── ui/           # UI elements
│   │   ├── pages/            # Page components
│   │   │   ├── admin/        # Admin pages
│   │   │   └── public/       # Public pages
│   │   ├── context/          # State management
│   │   ├── utils/            # Utilities & API
│   │   └── styles/           # Global styles
│   ├── package.json
│   └── vite.config.js
│
└── backend/                  # FastAPI Backend
    ├── app/
    │   ├── core/             # Core utilities
    │   │   ├── database.py   # MongoDB connection
    │   │   └── security.py   # Auth & JWT
    │   ├── routes/           # API endpoints
    │   │   ├── admin.py      # Admin routes
    │   │   ├── tokens.py     # Token management
    │   │   ├── testimonials.py
    │   │   └── public.py     # Public endpoints
    │   ├── schemas/          # Pydantic models
    │   └── main.py           # App entry point
    └── requirements.txt
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/
SECRET_KEY=your-super-secret-key-change-in-production
```

**Frontend (.env)**
```env
VITE_API_URL=/api
```

## 📖 How It Works

### Invite-Only Flow

1. **Admin creates a project** in the dashboard
2. **Admin generates an invite token** with expiration time
3. **Admin sends the unique link** to client via WhatsApp/Email
4. **Client clicks the link** and sees the project details
5. **Client writes testimonial** and submits
6. **Token is marked as used** - cannot be reused

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/register` | POST | Register admin account |
| `/api/admin/login` | POST | Login and get JWT token |
| `/api/admin/projects` | GET/POST | List/Create projects |
| `/api/tokens/generate` | POST | Generate invite token |
| `/api/tokens/validate/{token}` | GET | Validate token (public) |
| `/api/testimonials/submit` | POST | Submit testimonial (public) |
| `/api/public/testimonials` | GET | Get published testimonials |

## 🎯 Deployment

### Frontend (GitHub Pages / Vercel / Netlify)

```bash
cd frontend
npm run build
# Deploy the 'dist' folder
```

### Backend (Railway / Render / Fly.io)

```bash
# Using Docker
docker build -t testimonial-api .
docker run -p 8000:8000 testimonial-api
```

### MongoDB Atlas Setup
1. Create a free cluster at mongodb.com
2. Create a database user
3. Get the connection string
4. Add to backend configuration

## 🎨 Customization

### Theme Colors (tailwind.config.js)
```javascript
colors: {
  neon: {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    magenta: '#ff00aa',
    // Add your colors
  }
}
```

### Fonts
The system uses:
- **Orbitron** - Display/headings (futuristic)
- **Rajdhani** - Body text
- **JetBrains Mono** - Code/monospace

## 🔒 Security Features

- **JWT Authentication** - Secure admin access
- **Password Hashing** - bcrypt encryption
- **Token Expiration** - Automatic token invalidation
- **One-time Use** - Tokens can't be reused
- **CORS Configuration** - Protect API endpoints

## 📱 Screenshots

### Public Homepage
- Hero section with animated background
- Statistics display
- Featured testimonials
- How it works section

### Admin Dashboard
- Overview statistics
- Quick action cards
- Recent testimonials

### Token Management
- Generate new tokens
- Copy invite links
- Share via WhatsApp
- Track token status

### Testimonial Form
- Beautiful client-facing form
- Rating selection
- Form validation
- Success animation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🙏 Credits

- Design inspired by cyberpunk aesthetics
- Icons by Lucide React
- Animations by Framer Motion
- UI components built with Tailwind CSS

---

**Built with ❤️ for professional testimonial collection**

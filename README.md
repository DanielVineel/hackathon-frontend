# 🚀 Hackathon SaaS Platform

A comprehensive competitive programming and coding challenge platform with gamification, real-time evaluation, and community engagement features.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [User Roles & Access](#user-roles--access)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Models](#database-models)
- [API Endpoints](#api-endpoints)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Key Features Explained](#key-features-explained)
- [Middleware & Security](#middleware--security)
- [Roadmap](#roadmap)

## Overview

This platform empowers developers with:
- **Competitive Programming**: Solve challenges, compete on leaderboards
- **Gamified Learning**: Earn points, badges, and climb levels
- **Smart Tracking**: Monitor activity intensity, login patterns, and progress
- **Event Management**: Participate in hackathons, workshops, and competitions
- **Role-Based Access**: Different capabilities for students, managers, and administrators
- **Real-Time Evaluation**: Automated code execution with instant feedback

## Architecture

```
┌─────────────────────────────────────────────────────┐
│              Frontend (React + Redux)               │
│  ┌────────────┬────────────┬──────────┬──────────┐  │
│  │  Public    │  Student   │ Manager  │SuperAdmin│  │
│  │  Pages     │  Dashboard │ Dashboard│Dashboard │  │
│  └────────────┴────────────┴──────────┴──────────┘  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│         API Layer (Axios + Interceptors)            │
│         Services (saasAPI.js, pointsAPI, etc)       │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│         Backend (Express.js + Node.js)              │
│  ┌──────────┬──────────────┬────────┬────────────┐  │
│  │ Routes   │ Controllers  │Models  │Middleware  │  │
│  └──────────┴──────────────┴────────┴────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │      Authentication & Authorization          │  │
│  │  (JWT tokens, Role-based middleware)         │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│    Database (MongoDB) & Cache (Redis)              │
│  ┌─────────────────────────────────────────────┐  │
│  │ Users, Points, Calendar, Activity, Events  │  │
│  │ Submissions, Certificates, Payments         │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Features

### 👨‍💻 Student Features
- ✅ Solve coding problems with real-time execution
- ✅ View performance on leaderboards
- ✅ Track points and levels (Bronze → Diamond)
- ✅ Monitor activity intensity and consistency streaks
- ✅ Access calendar of events
- ✅ Participate in events and competitions
- ✅ Earn and download certificates
- ✅ View submission history with feedback

### 👔 Manager Features
- ✅ Create and manage events
- ✅ View registration statistics
- ✅ Track participation metrics
- ✅ Manage problems for events
- 🔒 Cannot delete events/problems (create-only model)
- ✅ View participant submission counts
- ✅ Generate reports on event performance

### 🔐 SuperAdmin Features
- ✅ Full system access
- ✅ Manage all users (view, edit, deactivate)
- ✅ Create/edit/delete events and problems
- ✅ View all submissions and activity
- ✅ Manage payment records
- ✅ Delete with soft-delete pattern (audit trail)
- ✅ System-wide analytics and reports
- ✅ Manage platform certificates and templates

### 👥 Public Features
- ✅ Browse events without login
- ✅ View platform features and information
- ✅ Register as student, manager, or superadmin
- ✅ Submit contact inquiries
- ✅ Read about and testimonials

## User Roles & Access

### Access Matrix

| Feature | Public | Student | Manager | SuperAdmin |
|---------|--------|---------|---------|-----------|
| Browse Events | ✅ | ✅ | ✅ | ✅ |
| View Points/Leaderboard | ❌ | ✅ | ❌ | ✅ |
| Solve Problems | ❌ | ✅ | ❌ | ✅ |
| Create Events | ❌ | ❌ | ✅ | ✅ |
| Delete Events | ❌ | ❌ | ❌ | ✅(soft) |
| View Registration Stats | ❌ | ❌ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ❌ | ✅ |
| Manage Certificates | ❌ | ❌ | ❌ | ✅ |

## Tech Stack

### Frontend
- **Framework**: React 18+
- **State Management**: Redux
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **Styling**: CSS3 with CSS Variables
- **Build Tool**: Vite
- **Design System**: Custom CSS variable system

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **Job Queue**: Bull/Redis Queue
- **Code Execution**: Judge0 API
- **Authentication**: JWT (Access + Refresh tokens)
- **Email**: SendGrid/Nodemailer

## Project Structure

### Backend (`hackathon-backend/`)

```
hackathon-backend/
├── config/
│   ├── db.js                 # MongoDB connection
│   └── redis.js              # Redis client
├── controllers/
│   ├── points.controller.js
│   ├── loginActivity.controller.js
│   ├── calendar.controller.js
│   ├── activityIntensity.controller.js
│   ├── auth.controller.js
│   ├── event.controller.js
│   ├── certificate.controller.js
│   └── ... (more controllers)
├── models/
│   ├── userPoints.model.js
│   ├── loginActivity.model.js
│   ├── calendarEvent.model.js
│   ├── activityIntensity.model.js
│   └── ... (more models)
├── routes/
│   ├── points.routes.js
│   ├── calendar.routes.js
│   ├── auth.routes.js
│   └── ... (more routes)
├── middlewares/
│   ├── auth.middleware.js    # JWT verification
│   ├── role.middleware.js    # Role-based access
│   ├── validate.middleware.js
│   └── rateLimit.middleware.js
├── services/
│   ├── judge0.service.js     # Code execution
│   └── codeExecuter.service.js
├── utils/
│   ├── generateToken.js
│   ├── generateCertificatePDF.js
│   ├── eventStatusUpdater.js
│   └── ... (more utilities)
├── workers/
│   └── submission.worker.js  # Job processing
├── logs/                     # Application logs
├── server.js                 # Express app entry
└── package.json
```

### Frontend (`hackathon-frontend/`)

```
hackathon-frontend/
├── src/
│   ├── pages/
│   │   ├── public/
│   │   │   ├── Home.jsx          # Hero, features, featured events
│   │   │   ├── Events.jsx        # Browse all events (not logged in)
│   │   │   ├── About.jsx         # About page with testimonials
│   │   │   └── Contact.jsx       # Contact form
│   │   ├── student/
│   │   │   ├── PointsDashboard.jsx
│   │   │   ├── Calendar.jsx
│   │   │   ├── ActivityIntensity.jsx
│   │   │   └── ... (more pages)
│   │   ├── manager/
│   │   │   ├── Dashboard.jsx
│   │   │   └── Events.jsx        # With registration stats
│   │   └── superadmin/
│   │       ├── Dashboard.jsx
│   │       └── ... (admin pages)
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── code-editor/
│   │   ├── DashboardCard.jsx     # Card component library
│   │   └── ProtectedRoute.jsx
│   ├── services/
│   │   ├── saasAPI.js            # Organized API service
│   │   └── api.js
│   ├── styles/
│   │   ├── globals.css           # Design system + variables
│   │   ├── PublicEvents.css
│   │   ├── PublicAbout.css
│   │   ├── PublicContact.css
│   │   └── ... (more styles)
│   ├── store/
│   │   └── slices/authSlice.js
│   ├── api/
│   │   └── api.js                # Axios instance
│   ├── App.jsx                   # Main routing
│   └── main.jsx
├── vite.config.js
└── package.json
```

## Database Models

### 1. userPoints Model
```javascript
{
  userId,
  totalPoints,
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond',
  breakdown: { problemsSolved, eventParticipation, ... },
  history: [{ points, reason, timestamp, ... }],
  createdAt, updatedAt
}
```

### 2. loginActivity Model
```javascript
{
  userId,
  sessionId,
  loginTime,
  logoutTime,
  device: { os, browser, type },
  ipAddress,
  location: { city, country },
  suspicious: boolean,
  createdAt, updatedAt
}
```

### 3. calendarEvent Model
```javascript
{
  title,
  description,
  startDate,
  endDate,
  type: 'hackathon' | 'workshop' | 'competition' | 'meetup',
  participants: [userId],
  attachments: [],
  isRecurring: boolean,
  reminders: [],
  status: 'active' | 'upcoming' | 'completed' | 'cancelled',
  createdAt, updatedAt
}
```

### 4. activityIntensity Model
```javascript
{
  userId,
  date,
  submissionsCount,
  timeSpent,
  intensityScore: 0-100,
  streak: { current, longest },
  loginStreak,
  weeklyActivity: [{ day, intensity }],
  monthlyActivity: [{ week, intensity }],
  patterns: { peakHours, favoriteProblems },
  createdAt, updatedAt
}
```

## API Endpoints

### Points API
```
POST   /api/points/add                # Add points to student
POST   /api/points/deduct             # Remove points
GET    /api/points/:userId            # Get user points summary
GET    /api/points/leaderboard        # Top 100 students
GET    /api/points/rank/:userId       # User's rank
POST   /api/points/batch              # Bulk add points
```

### Calendar API
```
GET    /api/calendar/month            # Get month's events
GET    /api/calendar/events           # All events
POST   /api/calendar/events           # Create event
PUT    /api/calendar/events/:id       # Update event
DELETE /api/calendar/events/:id       # Delete event (soft-delete for non-admin)
POST   /api/calendar/events/:id/join  # Join an event
```

### Activity Intensity API
```
GET    /api/activity/intensity/:userId      # Current intensity
GET    /api/activity/analysis/:userId       # Detailed analysis
GET    /api/activity/patterns/:userId       # Usage patterns
GET    /api/activity/streak/:userId        # Login streak info
GET    /api/activity/peers/:userId         # Compare with peers
```

### Login Activity API
```
POST   /api/login-activity/record    # Record login
POST   /api/login-activity/logout    # Record logout
GET    /api/login-activity/:userId   # Login history
GET    /api/login-activity/sessions/:userId  # Active sessions
POST   /api/login-activity/terminate/:sessionId  # End session
```

### Events API
```
GET    /api/events                   # List all events (public)
GET    /api/events/:id               # Event details
POST   /api/events                   # Create event (manager+)
PUT    /api/events/:id               # Update event
DELETE /api/events/:id               # Delete event (superadmin only)
GET    /api/events/:id/registrations # Registration count
GET    /api/events/:id/participants  # Participation details
```

## Installation & Setup

### Prerequisites
- Node.js 16+
- MongoDB 4.4+
- Redis 6+
- npm or yarn

### Backend Setup

1. **Clone and navigate**
```bash
cd hackathon-backend
npm install
```

2. **Create environment file** (`.env`)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hackathon
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_key
JUDGE0_API_KEY=your_judge0_api_key
SENDGRID_API_KEY=your_sendgrid_key
NODE_ENV=development
```

3. **Seed database** (optional)
```bash
npm run seed
```

4. **Start server**
```bash
npm run dev     # Development with nodemon
npm start       # Production
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate and install**
```bash
cd hackathon-frontend
npm install
```

2. **Create `.env` file**
```
VITE_API_URL=http://localhost:5000/api
```

3. **Start dev server**
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## Environment Variables

### Backend (.env)
```
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/hackathon
MONGODB_NAME=hackathon

# Cache
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=super_secret_jwt_key_change_this
JWT_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d

# Third-party APIs
JUDGE0_API_KEY=xxx
JUDGE0_API_HOST=judge0-ce.p.rapidapi.com

# Email Service
SENDGRID_API_KEY=xxx
SMTP_USER=noreply@hackathon.com
SMTP_PASS=xxx

# Logging
LOG_LEVEL=debug
LOG_FILE=logs/app.log
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Hackathon Platform
```

## Running the Application

### Development Mode

**Terminal 1 - Backend**
```bash
cd hackathon-backend
npm run dev
```

**Terminal 2 - Frontend**
```bash
cd hackathon-frontend
npm run dev
```

**Terminal 3 - Redis** (if not running as service)
```bash
redis-server
```

### Production Mode

**Backend**
```bash
npm start
```

**Frontend**
```bash
npm run build
npm run preview
```

## Key Features Explained

### 1. Points System
- Students earn points by **solving problems** (0-1000 pts)
- **Event participation** (10-500 pts based on rank)
- **Consistency bonuses** (streak multipliers)
- Points determine **levels** (Bronze, Silver, Gold, Platinum, Diamond)
- Global **leaderboard** shows top performers
- Points **history** tracks all transactions

### 2. Activity Intensity
- Tracks **daily, weekly, monthly** activity
- Calculates **consistency score** (perfect: 100%)
- Monitors **login streaks** (consecutive days)
- Identifies **peak hours** for coding
- Compares **performance against peers**
- Visual **patterns** showing preferred problem types

### 3. Calendar & Events
- **Smart calendar** shows upcoming events
- Supports **recurring events**
- **Reminders** and notifications
- **Participant management** with status tracking
- Event **categories**: Hackathon, Workshop, Competition, Meetup
- Status: Active, Upcoming, Completed, Cancelled

### 4. Role-Based Access

**Public Access**
- Home, Events browse, About, Contact
- No authentication required
- Can register for an account

**Student Dashboard**
- Points overview and leaderboard
- Calendar with events
- Activity intensity analysis
- Problem submissions
- Certificates earned

**Manager Access**
- Create events only (cannot delete)
- View registration statistics
- Track participation metrics
- Generate event reports
- Manage problems within events

**SuperAdmin Control**
- Full system access
- User management
- Soft-delete operations (audit trail)
- System-wide analytics
- Certificate management
- Payment and billing records

### 5. Code Execution & Evaluation
- Supports **20+ programming languages**
- **Real-time execution** with instant feedback
- **Automated testing** against problem's test cases
- Memory and **time limit enforcement**
- **Detailed error messages** and compiler output
- **Performance metrics** (execution time, memory used)

### 6. Certificates
- **Automatic generation** on achievement
- **PDF format** with verification QR code
- Shareable on **LinkedIn and social media**
- **Template system** for customization
- **Blockchain verification** option (roadmap)

## Middleware & Security

### Authentication Middleware
```javascript
// Verifies JWT token in Authorization header
// Stores decoded user info in req.user
// Rejects if token invalid/expired
```

### Role-Based Authorization
```javascript
// Checks req.user.role
// Allows/denies based on route requirements
// Returns 403 Forbidden if unauthorized
```

### Rate Limiting
```javascript
// Limits requests per IP/user
// Prevents brute force attacks
// 100 requests per 15 minutes (configurable)
```

### Validation Middleware
```javascript
// Validates request body against schemas
// Sanitizes inputs
// Returns 400 Bad Request with error details
```

### Security Features
- ✅ HTTPS ready
- ✅ CORS configured
- ✅ Password hashing (bcrypt)
- ✅ JWT tokens with expiration
- ✅ Refresh token rotation
- ✅ Rate limiting on auth endpoints
- ✅ SQL injection prevention (MongoDB)
- ✅ XSS protection via sanitization
- ✅ CSRF tokens for state-changing operations

## Roadmap

### Phase 1 ✅ (Complete)
- [x] Backend models and controllers
- [x] Frontend design system
- [x] Public pages (Home, Events, About, Contact)
- [x] Student dashboards
- [x] Points and leaderboard system
- [x] Calendar and events management
- [x] Activity intensity tracking

### Phase 2 🔄 (In Progress)
- [ ] Manager-specific dashboards with stats
- [ ] SuperAdmin comprehensive management panel
- [ ] Role-based middleware enforcement
- [ ] Soft-delete implementation
- [ ] Email notifications
- [ ] Comprehensive README ✅

### Phase 3 📋 (Planned)
- [ ] Social features (comments, discussions)
- [ ] Team competitions
- [ ] AI-powered problem recommendations
- [ ] Mobile app (React Native)
- [ ] Video tutorials integration
- [ ] Mentorship program
- [ ] Job board integration

### Phase 4 🎯 (Future)
- [ ] Blockchain certificates
- [ ] Payment integration
- [ ] API rate limiting per tier
- [ ] Advanced analytics dashboard
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Live coding interviews

## Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@hackathon.com or visit our contact page.

---

**Built with ❤️ by the Hackathon Team**

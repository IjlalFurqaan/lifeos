# 🚀 LifeOS - AI-Powered Life Command Center

A production-grade full-stack life management application with React frontend and Node.js/Express backend.

![LifeOS](https://img.shields.io/badge/LifeOS-Full%20Stack-ff6b6b?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge)
![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge)

## 🌟 What Makes LifeOS Different?

Most productivity apps focus on **one thing** — tasks, habits, or finance. LifeOS is a **unified life operating system** that connects every aspect of your personal growth in one place.

### vs. Traditional Todo Apps (Todoist, TickTick, Things)
| Feature | Traditional Apps | LifeOS |
|---------|------------------|--------|
| Task tracking | ✅ | ✅ |
| Habit tracking | ❌ (separate app) | ✅ Built-in |
| Finance tracking | ❌ | ✅ Built-in |
| Health logging | ❌ | ✅ Built-in |
| Gamification | Limited | 🎮 **Full XP/Level System** |
| AI insights | Limited | 🤖 **Gemini AI Powered** |

### vs. Habit Trackers (Habitica, Streaks)
- **LifeOS** doesn't just track habits — it connects them to your **goals, tasks, and overall life progress**
- Unified **XP system** across ALL activities, not just habits
- **Focus sessions** integrated with habit tracking

### vs. Finance Apps (Mint, YNAB)
- LifeOS provides **holistic tracking** — see how your productivity affects your finances
- **Same dashboard** shows financial health alongside life goals
- No separate apps to juggle

### vs. Life Dashboard Tools (Notion, Obsidian)
- **Zero configuration** — LifeOS works out of the box with a premium UI
- **Backend-powered** — real authentication, real database, cloud-ready
- **Gamification built-in** — Notion requires manual setup for XP systems

### 🎯 The LifeOS Philosophy

> **"Your life is one system, not 10 separate apps."**

LifeOS treats your life as an interconnected operating system where:
- Completing tasks **earns XP** that levels you up
- Building habits **increases your streak** which boosts motivation
- Focus sessions **log automatically** to your analytics
- Financial tracking **lives alongside** your goals
- Health metrics **correlate** with productivity data
- AI **generates personalized insights** from your combined data

## ✨ Key Differentiators

### 1. 🎮 Gamification That Motivates
- **XP & Leveling System** — Every task, habit, and focus session earns XP
- **Achievement Unlocks** — Milestone badges for consistency
- **Streaks** — Visual fire indicators for daily activity

### 2. 🤖 AI-Powered Insights (Gemini)
- **Motivational Quotes** — AI-generated daily inspiration
- **Smart Suggestions** — Context-aware productivity tips
- **Data Analysis** — AI interprets your patterns

### 3. 🌙 Premium Dark Mode UI
- **Glassmorphism design** with blur effects
- **Animated starfield background**
- **Coral (#ff6b6b) and Teal (#4ecdc4)** accent palette
- **Smooth micro-animations** throughout

### 4. 📊 Unified Analytics
- Single dashboard for **all life metrics**
- **Charts & visualizations** for goals, habits, finances, and health
- **Weekly/monthly trends** across categories

### 5. 🔐 Production-Ready Architecture
- **JWT authentication** with secure password hashing
- **PostgreSQL database** with Prisma ORM
- **Docker-ready** for easy deployment
- **Monorepo structure** for scalability

---

## 📁 Project Structure

```
lifeos/
├── frontend/          # React + Vite + TypeScript
├── backend/           # Express + Prisma + PostgreSQL
├── shared/            # Shared TypeScript types
├── docker-compose.yml # PostgreSQL for local dev
└── package.json       # Root workspace config
```

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, TypeScript, Vite, MUI, Tailwind CSS |
| **Backend** | Node.js, Express, Prisma ORM |
| **Database** | PostgreSQL |
| **Auth** | JWT + bcrypt |
| **AI** | Google Gemini API |
| **Validation** | Zod |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker (for PostgreSQL) OR a cloud PostgreSQL URL

### 1. Clone & Install

```bash
git clone <repo-url>
cd lifeos
npm run install:all
```

### 2. Start Database

```bash
# Using Docker
npm run docker:up

# Or provide your own DATABASE_URL in backend/.env
```

### 3. Configure Environment

**Backend:**
Navigate to the `backend` folder and create a `.env` file:
```bash
cd backend
cp .env.example .env
```
*   The default database URL assumes the Docker setup (`postgresql://postgres:password@localhost:5432/lifeos?schema=public`).
*   Change `JWT_SECRET` for production.

**Frontend:**
Navigate to the `frontend` folder and create a `.env` file:
```bash
cd ../frontend
cp .env.example .env
```
*   `VITE_API_URL` should point to your backend (default: `http://localhost:3001/api`).
*   Add your `VITE_GEMINI_API_KEY` if you want to use AI features.

### 4. Initialize Database

```bash
npm run db:push
```

### 5. Run Development

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Prisma Studio: `npm run db:studio`

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| GET/POST | `/api/goals` | Manage goals |
| GET/POST | `/api/tasks` | Manage tasks |
| GET/POST | `/api/habits` | Manage habits |
| GET/POST | `/api/transactions` | Track finances |
| GET/POST | `/api/health` | Log health data |
| GET/POST | `/api/learning` | Track learning |
| GET/POST | `/api/ideas` | Capture ideas |
| GET/POST | `/api/focus` | Focus sessions |

## 🎮 Features

- **Dashboard** - Overview with stats & quick actions
- **Goals & Tasks** - Priority-based management with XP rewards
- **Habits** - Daily tracking with streak system
- **Finance** - Income/expense tracking with charts
- **Health** - Water, sleep, mood, workout logging
- **Learning** - Course & skill progress tracking
- **Ideas** - Notes with tags & pinning
- **Focus** - Pomodoro timer with session stats
- **Analytics** - Data visualizations
- **Gamification** - XP, levels, achievements

## 🔧 Scripts

```bash
npm run dev          # Run both frontend & backend
npm run build        # Build for production
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
npm run docker:up    # Start PostgreSQL
npm run docker:down  # Stop PostgreSQL
```

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Calendar integration (Google, Outlook)
- [ ] Social features (friend challenges)
- [ ] Advanced AI coaching
- [ ] Wearable data integration (Apple Health, Fitbit)

## 📄 License

MIT License

---

Built with ❤️ by Ijlal Furqaan

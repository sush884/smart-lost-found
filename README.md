# Smart Lost & Found Intelligence System
> **Cloud-Based Campus Recovery Platform — Advanced 3D Edition**  
> *Tagline: Lost Something? Let Intelligence Find It.*  
> **Version:** 2.0 | **Level:** 5th-Semester CSE / Final-Year Portfolio

---

## 🌟 Project Highlights

- **Campus-Wide Radar:** Centralized reporting for lost and found items across curated campus zones (Central Library, Main Auditorium, Engineering Block A, Science Block B, Student Activity Center, Campus Cafeteria, Sports Ground, North Gate Security).
- **Heuristic Matching Engine:** Combines category, token overlap, elapsed time, campus proximity, and attributes using the formal formula from `spec.md`:
  $$\text{score} = 0.30 \times \text{category} + 0.25 \times \text{text} + 0.20 \times \text{date} + 0.15 \times \text{location} + 0.10 \times \text{attributes}$$
- **Zero Public Clue Exposure:** Public descriptions show only generic visual attributes. Identifying marks, lock screen wallpapers, and pocket contents are kept strictly confidential for moderator review.
- **Digital Recovery Pass:** Cryptographically hashed, one-time, short-lived QR token for physical handover verification at North Gate Security.
- **Premium 3D Experience:** Interactive WebGL 3D hero scene built with Three.js, React Three Fiber, and Drei, featuring floating campus belongings with low-power mobile fallbacks.
- **Real Cloud Computing:** Managed PostgreSQL DBaaS, Supabase Auth session tokens, private cloud object storage (`item-images`) with time-limited signed URLs, and full Row-Level Security (RLS).

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Single-Page Application (SPA) |
| **Styling** | Tailwind CSS | Responsive modern glassmorphism design |
| **Motion** | Framer Motion, GSAP | Page and modal transitions |
| **3D Graphics** | Three.js, React Three Fiber, Drei | Floating 3D belongings scene |
| **Charts** | Recharts | Admin telemetry and category analytics |
| **Icons** | Lucide React | Modern iconography |
| **Backend** | Node.js, Express.js (ESM) | RESTful API, authentication & matching engine |
| **Database** | Supabase Cloud PostgreSQL | Relational DBaaS with 11 tables & RLS |
| **Auth** | Supabase Auth | JWT-based secure user sessions & roles |
| **Storage** | Supabase Storage (Private) | Encrypted item images & signed access URLs |
| **Testing** | Vitest, Supertest | Automated unit & integration testing |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js >= 18.0.0 (Tested on Node.js v25.8.0)
- npm >= 9.0.0

### 2. Environment Configuration

#### Backend (`server/.env`):
```env
PORT=5000
NODE_ENV=development
APP_ORIGIN=http://localhost:5173
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
HANDOVER_TOKEN_SECRET=campus_recovery_secret_salt_2026
```

#### Frontend (`client/.env`):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Database Migration
Run the SQL migration in your Supabase SQL Editor:
- [`supabase/migrations/20261116000001_initial_schema.sql`](file:///c:/Users/sushm/OneDrive/Desktop/@SNPSU/mini/New%20folder/CCT/supabase/migrations/20261116000001_initial_schema.sql)
- [`supabase/seed.sql`](file:///c:/Users/sushm/OneDrive/Desktop/@SNPSU/mini/New%20folder/CCT/supabase/seed.sql)
- [`supabase/storage_setup.sql`](file:///c:/Users/sushm/OneDrive/Desktop/@SNPSU/mini/New%20folder/CCT/supabase/storage_setup.sql)

### 4. Running Locally
From the workspace root:

```bash
# Start backend server (Port 5000)
npm run server:start

# In a separate terminal, start frontend (Port 5173)
npm run client:dev
```

Open `http://localhost:5173` in your browser.

---

## 🧪 Automated Testing

Execute the test suites:

```bash
npm run server:test
```

Output:
```text
 ✓ test/matching.test.js (4 tests)
 ✓ test/health.test.js (2 tests)
 ✓ test/auth.test.js (6 tests)
 Test Files  3 passed (3)
 Tests       12 passed (12)
```

Frontend production verification:
```bash
npm run client:build
```

---

## 📂 Repository Structure

```
smart-lost-found/
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── campus/         # CampusMap.jsx
│   │   │   ├── common/         # AiAssistantModal.jsx, HandoverPassModal.jsx
│   │   │   ├── layout/         # Navbar.jsx, Footer.jsx, AppLayout.jsx
│   │   │   └── three/          # HeroScene.jsx (3D canvas)
│   │   ├── context/            # AuthContext.jsx
│   │   ├── pages/              # LandingPage, Dashboard, Browse, Report, ItemDetail, Claims, Moderation, Analytics
│   │   ├── routes/             # AppRoutes.jsx
│   │   └── services/           # api.js, supabase.js
├── server/                     # Express REST API backend
│   ├── src/
│   │   ├── config/             # Environment & Supabase config
│   │   ├── controllers/        # User, Report, Category, Claim, Notification, Admin controllers
│   │   ├── middleware/         # Auth, Upload (Multer)
│   │   ├── routes/             # Health, User, Category, Report, Claim, Notification, Admin routes
│   │   └── services/           # Matching engine & duplicate detection services
│   └── test/                   # Vitest automated test suites
├── supabase/
│   ├── migrations/             # 20261116000001_initial_schema.sql
│   ├── seed.sql                # Categories and campus locations
│   └── storage_setup.sql       # Private bucket setup & policies
└── docs/                       # Project report, architecture, API, database, testing, deployment guides
```

---

## 🛡️ Security & Privacy Guardrails

1. **Role-Based Access Control:** Users access only their own private records (`student`), while claim decisions and QR token creation are strictly restricted to verified staff (`moderator` and `admin`).
2. **Private Storage Buckets:** Photographs uploaded to `item-images` are kept private; clients receive short-lived (1-hour) presigned cryptographic URLs.
3. **One-Time Handover Tokens:** QR passes expire after 24 hours and can be redeemed only once; repeated scans are rejected immediately with tamper logs.

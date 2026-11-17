# Deployment & Cloud Operations Guide
## Smart Lost & Found Intelligence System

### 1. Cloud Architecture Setup

```
[Vercel Frontend]   <--->   [Render / Railway Node.js API]   <--->   [Supabase Cloud]
(React 18 + Vite)           (Express.js REST Engine)                 (Postgres + Auth + Storage)
```

---

### 2. Step-by-Step Deployment Procedure

#### Step 1: Provision Cloud Database & Storage (Supabase)
1. Create a new project at [supabase.com](https://supabase.com).
2. In the Supabase SQL Editor, run:
   - `supabase/migrations/20261116000001_initial_schema.sql`
   - `supabase/seed.sql`
   - `supabase/storage_setup.sql`
3. Retrieve your project URL, `anon` public key, and `service_role` secret from **Project Settings > API**.

#### Step 2: Deploy Backend REST API (Render / Railway / Fly.io)
1. Connect your repository to a Node.js host.
2. Root Directory: `server`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Configure Environment Variables:
   - `PORT`: `5000` (or assigned by host)
   - `NODE_ENV`: `production`
   - `APP_ORIGIN`: `https://your-frontend.vercel.app`
   - `SUPABASE_URL`: `https://your-project.supabase.co`
   - `SUPABASE_ANON_KEY`: `<anon-key>`
   - `SUPABASE_SERVICE_ROLE_KEY`: `<service-role-key>`
   - `HANDOVER_TOKEN_SECRET`: `<secure-random-salt>`

#### Step 3: Deploy Frontend (Vercel)
1. Import repository in [vercel.com](https://vercel.com).
2. Root Directory: `client`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Configure Environment Variables:
   - `VITE_SUPABASE_URL`: `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `<anon-key>`
   - `VITE_API_BASE_URL`: `https://your-backend-api.onrender.com/api`

---

### 3. Production Verification & Monitoring
- Test health endpoint: `https://your-backend-api.onrender.com/api/health`
- Verify CORS headers only accept requests from `https://your-frontend.vercel.app`.
- Test user registration and ensure `profiles` row is created automatically via the Postgres trigger.
- Inspect database table `audit_logs` in Supabase to confirm security actions are tracked.

# Verification & Testing Strategy
## Smart Lost & Found Intelligence System

### 1. Test Matrix (from `spec.md` Section 15)

| ID | Test Scenario | Target Layer | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :--- | :---: |
| **TC-01** | Register with valid campus email | Supabase Auth / Trigger | Account and database profile created with role `student`. | **PASS** |
| **TC-02** | Open protected dashboard without token | Middleware `requireAuth` | 401 Unauthorized; no protected data leaked. | **PASS** |
| **TC-03** | Create valid lost report | API `POST /api/reports` | Saved with verified `owner_id` derived from token. | **PASS** |
| **TC-04** | Upload unsupported file type | Multer `fileFilter` | 400 Bad Request; rejected with MIME error. | **PASS** |
| **TC-05** | Unauthorized user requests private image | Supabase Storage RLS | Access denied; direct public access returns 403. | **PASS** |
| **TC-06** | Create similar lost/found records | Matching Service | Composite score >= 50 and explainable reasons generated. | **PASS** |
| **TC-07** | Image service unavailable fallback | Report Controller | Report creation succeeds; metadata matching continues. | **PASS** |
| **TC-08** | User reads another user's claim | API / Claims RLS | 403 Forbidden / denied. | **PASS** |
| **TC-09** | Student calls moderator endpoint | Middleware `requireRole` | 403 Forbidden; role 'student' cannot access queue. | **PASS** |
| **TC-10** | Moderator approves claim | API `PATCH /api/moderation/:id` | Status becomes `approved`; audit event logged. | **PASS** |
| **TC-11** | Redeem same QR token twice | API `POST /api/claims/handover/redeem` | First succeeds; second rejected with error. | **PASS** |
| **TC-12** | Redeem expired token | API `POST /api/claims/handover/redeem` | Rejected with expiration message. | **PASS** |
| **TC-13** | Confirm recovery | Handover Flow | Report and claim status updated to `recovered`. | **PASS** |
| **TC-14** | Responsive 320px mobile viewport | Tailwind Responsive Layout | No clipping; navigation converts to mobile drawer. | **PASS** |
| **TC-15** | WebGL fallback / Reduced motion | `HeroScene.jsx` | Graceful fallback illustration shown on low-power devices. | **PASS** |

---

### 2. Running Automated Tests

#### Backend Test Suite:
```bash
cd server
npm test
```
All 12 unit and integration tests execute using Vitest.

#### Frontend Build Verification:
```bash
cd client
npm run build
```
Compiles and bundles the complete application with Vite and Tailwind.

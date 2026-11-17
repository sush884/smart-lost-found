# REST API Reference
## Smart Lost & Found Intelligence System

Base URL: `http://localhost:5000/api` (Local) / `/api` (Production)

Protected routes require an `Authorization: Bearer <JWT>` header obtained from Supabase Auth.

---

### 1. System & Profile Endpoints

#### `GET /api/health`
- **Access:** Public
- **Description:** Health status, version, and active cloud services.
- **Response:**
  ```json
  {
    "status": "ok",
    "system": "Smart Lost & Found Intelligence System API",
    "version": "2.0.0",
    "cloudServices": {
      "database": "Supabase PostgreSQL",
      "auth": "Supabase Auth",
      "storage": "Supabase Private Storage (item-images)"
    }
  }
  ```

#### `GET /api/me`
- **Access:** Authenticated
- **Description:** Retrieves the current authenticated user's profile, role, and department.

#### `PATCH /api/me`
- **Access:** Authenticated (Self)
- **Description:** Updates allowed profile attributes (`displayName`, `department`). Role and email cannot be modified by the client.

---

### 2. Taxonomy & Locations

#### `GET /api/categories`
- **Access:** Public
- **Description:** Returns all active item categories.

#### `GET /api/locations`
- **Access:** Public
- **Description:** Returns all active campus zones (Library, Cafeteria, Auditorium, etc.).

---

### 3. Reports & Images

#### `POST /api/reports`
- **Access:** Authenticated
- **Payload:**
  ```json
  {
    "reportType": "lost",
    "title": "Black Dell XPS Laptop Sleeve",
    "description": "Black sleeve with blue zipper and sticker on top",
    "categoryId": "11111111-1111-1111-1111-111111111101",
    "locationId": "22222222-2222-2222-2222-222222222201",
    "eventAt": "2026-11-16T14:30:00Z",
    "colour": "Black",
    "brand": "Dell",
    "privateNotes": "Lock screen wallpaper is a golden retriever"
  }
  ```
- **Description:** Derives `owner_id` from the verified session, runs duplicate check, and asynchronously calculates potential matches.

#### `GET /api/reports`
- **Access:** Public-safe / Authenticated
- **Query Parameters:** `type`, `category`, `location`, `status`, `search`, `page`, `limit`
- **Description:** Returns paginated reports with presigned image URLs. Strips private notes from public viewers.

#### `GET /api/reports/:id`
- **Access:** Public-safe / Authenticated
- **Description:** Detailed view. Only the report owner or authorized staff (`moderator`, `admin`) can view `private_notes`.

#### `POST /api/reports/:id/images`
- **Access:** Authenticated (Owner or Staff)
- **Content-Type:** `multipart/form-data`
- **Description:** Uploads image into `item-images` private bucket (max 5MB) and creates database reference.

#### `GET /api/reports/:id/matches`
- **Access:** Authenticated
- **Description:** Returns all potential matches computed by the heuristic engine for this item.

---

### 4. Ownership Claims & Handover

#### `POST /api/claims`
- **Access:** Authenticated
- **Payload:**
  ```json
  {
    "foundReportId": "REPORT_UUID",
    "privateAnswers": {
      "identifyingMarks": "White scratch on corner",
      "compartmentContentsOrWallpaper": "Yellow sticky note inside front pouch"
    }
  }
  ```
- **Description:** Submits private verification proof to the moderation queue.

#### `GET /api/claims/mine`
- **Access:** Authenticated (Self)
- **Description:** View user's submitted claims and statuses.

#### `GET /api/claims/moderation/queue`
- **Access:** Moderator / Admin
- **Description:** Full review queue including claimant details and confidential answers.

#### `PATCH /api/claims/moderation/:id`
- **Access:** Moderator / Admin
- **Payload:**
  ```json
  {
    "status": "approved",
    "decisionReason": "Evidence matches item physical examination."
  }
  ```

#### `POST /api/claims/:id/handover-token`
- **Access:** Moderator / Admin
- **Description:** Generates an opaque, one-time 48-character cryptographic token expiring in 24 hours.

#### `POST /api/claims/handover/redeem`
- **Access:** Moderator / Admin
- **Payload:** `{ "rawToken": "48_CHAR_TOKEN" }`
- **Description:** Hashes token with HMAC SHA-256 and checks database. Marks token as redeemed, claim as approved, report as recovered, and logs security audit.

---

### 5. Notifications & Admin Telemetry

#### `GET /api/notifications`
- **Access:** Authenticated
- **Description:** Returns user's in-app alerts and notifications.

#### `GET /api/admin/analytics`
- **Access:** Admin
- **Description:** Real aggregate statistics: total reports, active lost/found, recovery rate, resolution time, category and location distribution.

#### `GET /api/admin/audit-logs`
- **Access:** Admin
- **Description:** Audit trail of critical actions and state changes.

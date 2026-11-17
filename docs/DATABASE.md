# Database Design & Schema Reference
## Smart Lost & Found Intelligence System

The application relies on Supabase Managed PostgreSQL. Primary keys are UUIDs, and foreign keys maintain referential integrity.

---

### Entity Relationship Model

```
+----------------+        +-----------------+
|    PROFILES    | <----+ |     REPORTS     | <----+ REPORT_IMAGES
+----------------+        +-----------------+
        ^                          ^
        |                          |
+----------------+        +-----------------+
|     CLAIMS     | <----+ |     MATCHES     |
+----------------+        +-----------------+
        |
        v
+-----------------+
| HANDOVER_TOKENS |
+-----------------+
```

---

### Schema Definitions

#### 1. `profiles`
Links directly to `auth.users(id)` via automated trigger `handle_new_user()`.
- `id` (UUID, PK, FK -> `auth.users.id`)
- `display_name` (TEXT, NOT NULL)
- `campus_email` (TEXT, UNIQUE, NOT NULL)
- `role` (TEXT, NOT NULL, DEFAULT `'student'`, CHECK in `('student', 'staff', 'moderator', 'admin')`)
- `department` (TEXT)
- `is_active` (BOOLEAN, DEFAULT TRUE)
- `created_at` / `updated_at` (TIMESTAMPTZ)

#### 2. `categories`
- `id` (UUID, PK)
- `name` (TEXT, UNIQUE, NOT NULL)
- `description` (TEXT)
- `icon` (TEXT)
- `is_active` (BOOLEAN, DEFAULT TRUE)

#### 3. `campus_locations`
- `id` (UUID, PK)
- `name` (TEXT, UNIQUE, NOT NULL)
- `zone_code` (TEXT)
- `description` (TEXT)
- `latitude` / `longitude` (NUMERIC)
- `is_active` (BOOLEAN, DEFAULT TRUE)

#### 4. `reports`
- `id` (UUID, PK)
- `owner_id` (UUID, FK -> `profiles.id`)
- `report_type` (TEXT, CHECK in `('lost', 'found')`)
- `title` (TEXT, NOT NULL)
- `description_public` (TEXT, NOT NULL)
- `category_id` (UUID, FK -> `categories.id`)
- `location_id` (UUID, FK -> `campus_locations.id`)
- `event_at` (TIMESTAMPTZ, NOT NULL)
- `colour` (TEXT)
- `brand` (TEXT)
- `attributes_public` (JSONB)
- `private_notes` (TEXT) — *Kept confidential; never exposed to public*
- `status` (TEXT, DEFAULT `'open'`, CHECK in `('open', 'matched', 'claimed', 'recovered', 'closed', 'rejected')`)
- `held_by` (TEXT)
- `created_at` / `updated_at` / `closed_at` (TIMESTAMPTZ)

#### 5. `report_images`
- `id` (UUID, PK)
- `report_id` (UUID, FK -> `reports.id`)
- `storage_path` (TEXT, NOT NULL)
- `mime_type` (TEXT, NOT NULL)
- `file_size_bytes` (BIGINT, NOT NULL)
- `is_primary` (BOOLEAN, DEFAULT FALSE)

#### 6. `matches`
- `id` (UUID, PK)
- `lost_report_id` (UUID, FK -> `reports.id`)
- `found_report_id` (UUID, FK -> `reports.id`)
- `category_score` / `text_score` / `date_score` / `location_score` / `attribute_score` (NUMERIC)
- `final_score` (NUMERIC, 0.00 to 100.00)
- `explanation` (JSONB)
- `status` (TEXT, CHECK in `('suggested', 'reviewed', 'dismissed', 'claimed')`)
- CONSTRAINT `uq_lost_found_match` UNIQUE (`lost_report_id`, `found_report_id`)

#### 7. `claims`
- `id` (UUID, PK)
- `found_report_id` (UUID, FK -> `reports.id`)
- `match_id` (UUID, FK -> `matches.id`, NULLABLE)
- `claimant_id` (UUID, FK -> `profiles.id`)
- `private_answers` (JSONB, NOT NULL)
- `status` (TEXT, DEFAULT `'pending'`, CHECK in `('pending', 'info_requested', 'approved', 'rejected', 'cancelled')`)
- `moderator_id` (UUID, FK -> `profiles.id`, NULLABLE)
- `moderator_note` / `decision_reason` (TEXT)

#### 8. `handover_tokens`
- `id` (UUID, PK)
- `claim_id` (UUID, FK -> `claims.id`)
- `token_hash` (TEXT, UNIQUE, NOT NULL)
- `expires_at` (TIMESTAMPTZ, NOT NULL)
- `redeemed_at` (TIMESTAMPTZ, NULLABLE)
- `created_by` (UUID, FK -> `profiles.id`)

#### 9. `notifications`
- `id` (UUID, PK)
- `user_id` (UUID, FK -> `profiles.id`)
- `type` / `title` / `body_public` (TEXT)
- `related_report_id` / `related_claim_id` (UUID, NULLABLE)
- `is_read` (BOOLEAN, DEFAULT FALSE)

#### 10. `audit_logs`
- `id` (UUID, PK)
- `actor_id` (UUID, FK -> `profiles.id`, NULLABLE)
- `action` / `entity_type` (TEXT, NOT NULL)
- `entity_id` (UUID, NULLABLE)
- `metadata_safe` (JSONB)
- `created_at` (TIMESTAMPTZ)

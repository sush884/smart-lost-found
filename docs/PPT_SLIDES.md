# PRESENTATION SLIDES & VIVA DEFENSE DECK
## Smart Lost & Found Intelligence System — Cloud-Based Campus Recovery Platform

---

### Slide 1: Title & Project Overview
- **Title:** Smart Lost & Found Intelligence System
- **Subtitle:** Cloud-Based Campus Recovery Platform — Advanced 3D Edition
- **Domain:** Cloud Computing, Distributed Web Systems & Applied Machine Learning
- **Version:** 2.0
- **Tagline:** *Lost Something? Let Intelligence Find It.*

---

### Slide 2: Problem Statement
- Campus lost-and-found information is scattered across informal WhatsApp groups, social media, and decentralized physical security desks.
- Searching for belongings is slow, manual, and unreliable.
- **Privacy Hazard:** Publicly sharing photos with serial numbers, unique markings, or lockscreens enables fraudulent ownership claims.
- **No Traceability:** Handover of found items lacks systematic verification and audit logs.

---

### Slide 3: Proposed Solution
- **Centralized Platform:** A single, responsive campus web portal for reporting lost and found belongings.
- **Explainable Matching Engine:** Automated semantic correlation between lost notices and found turn-ins.
- **Strict Evidence Privacy:** Separation of public descriptions from private ownership clues.
- **Digital Recovery Pass:** Cryptographically verified, one-time expiring QR token for custody desk handovers.
- **Selective 3D Web Design:** High-performance, modern 3D interactive hero with hardware-accelerated animations and mobile fallbacks.

---

### Slide 4: Technology Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide Icons.
- **3D Graphics:** Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`).
- **Backend:** Node.js, Express REST API, Helmet, Multer, Rate Limiting.
- **Cloud Database:** Supabase Managed PostgreSQL with Row-Level Security (RLS).
- **Cloud Auth:** Supabase Auth (JWT session management & RBAC).
- **Cloud Storage:** Supabase Storage private bucket (`item-images`) with presigned URLs.
- **Testing:** Vitest & Supertest automated test suites.

---

### Slide 5: Cloud Architecture & Service Model
- **SaaS Architecture:** Cloud-hosted responsive web application accessible anywhere on campus.
- **DBaaS (Database-as-a-Service):** Cloud PostgreSQL with automated indexing, constraints, and triggers.
- **Object Storage:** Item photographs stored in private cloud buckets, decoupled from API instances.
- **Authentication-as-a-Service:** Managed cryptographic session validation and token issuance.
- **PaaS (Platform-as-a-Service):** Stateless, scalable REST API deployed on cloud container hosting.

---

### Slide 6: Database Design (11 Relational Tables)
1. `profiles`: User identity, campus email, and verified role.
2. `categories`: Electronics, Keys, Wallets, Bags, Books, etc.
3. `campus_locations`: Central Library, Auditorium, Engineering Block, Cafeteria, etc.
4. `reports`: Public descriptions, timestamps, status, and confidential notes.
5. `report_images`: Encrypted storage paths and MIME metadata.
6. `matches`: Composite scores, component breakdowns, and explainable reasons.
7. `claims`: Confidential claimant answers and moderator notes.
8. `handover_tokens`: HMAC-SHA-256 token hashes and expiration timestamps.
9. `notifications`: Real-time user in-app alerts.
10. `watchlists`: User saved search alerts.
11. `audit_logs`: Security audit events and actor tracking.

---

### Slide 7: Core Workflow: Report to Recovery
```
1. Report Filed (Lost / Found) ---> 2. Automatic AI Heuristic Match
                                             |
                                             v
4. Physical Handover (QR Pass) <--- 3. Private Claim & Staff Review
```
- **Step 1:** User submits a public-safe report with optional photo.
- **Step 2:** Engine scans opposite-type open records and calculates similarity scores.
- **Step 3:** Claimant submits confidential answers (wallpaper, scratches, contents).
- **Step 4:** Moderator approves and issues an expiring, single-use QR pass for custody desk pickup.

---

### Slide 8: The Heuristic Matching Engine
Baseline formula implemented from `spec.md`:
$$\text{Score} = 0.30 \times \text{Category} + 0.25 \times \text{Text} + 0.20 \times \text{Date} + 0.15 \times \text{Location} + 0.10 \times \text{Attributes}$$
- **Category (30%):** Exact match across campus taxonomy.
- **Text (25%):** Normalized token overlap and Jaccard similarity.
- **Date (20%):** Temporal proximity with sliding 14-day decay.
- **Location (15%):** Exact campus zone match.
- **Attributes (10%):** Color and brand manufacturer alignment.
- **Score Bands:** >= 80% Strong Potential Match | 60–79% Possible Match | < 60% Low similarity.

---

### Slide 9: Security, Privacy & Abuse Prevention
- **Row-Level Security (RLS):** Database-level access control preventing unauthorized data queries.
- **Zero Public Clue Exposure:** Passwords, pocket contents, and serial numbers are strictly withheld from public APIs.
- **Presigned URLs:** Cloud photos are never stored in public folders; access is granted via 1-hour signed tokens.
- **One-Time Handover Pass:** Cryptographic HMAC-SHA-256 token hashing; automatically revoked after single redemption.
- **Security Audit Logs:** Privileged moderation actions are immutably logged with timestamps.

---

### Slide 10: Premium 3D UI/UX Highlights
- **Interactive 3D Hero Scene:** Three.js / React Three Fiber scene with floating smartphone, keys, smartwatch, backpack, and textbook.
- **Smooth Physics & Rotation:** Gentle drifting with ambient lighting and contact shadows.
- **Mobile & Accessibility Fallback:** Automatically switches to an accessible lightweight illustration on devices without WebGL or with `prefers-reduced-motion` enabled.
- **Interactive Campus Radar Map:** Clickable zone map with visual pins for campus buildings.

---

### Slide 11: Verification & Testing Results
- **Automated Backend Tests:** 12/12 passing tests across `health.test.js`, `auth.test.js`, and `matching.test.js`.
- **RBAC Security Tests:** Verified 401 Unauthorized on missing tokens and 403 Forbidden on role escalations.
- **Frontend Production Build:** Vite production bundle compiled with 0 errors.

---

### Slide 12: Demonstration Scenarios
- **Scenario A (Heuristic Match):** Student reports a lost laptop sleeve near the Library; an opposite found record triggers an in-app match alert with 92% confidence and explainable reasons.
- **Scenario B (Private Claim & Handover):** Student submits confidential evidence; campus moderator reviews clues and issues an expiring digital QR pass; custody desk redeems token and closes report.
- **Scenario C (Cloud Proof):** Inspecting the PostgreSQL database rows, private cloud storage signed URLs, and real-time audit logs in Supabase.

---

### Slide 13: Viva Defense & Key Oral Examination Questions
1. **Q: Why is this considered a Cloud Computing project rather than just a web app?**  
   *A:* It demonstrates true cloud service consumption: Database-as-a-Service (Supabase PostgreSQL), Authentication-as-a-Service, Cloud Object Storage with presigned cryptographic URLs, hosted backend compute, and database-level Row-Level Security.
2. **Q: Why is AI/matching score not used to automatically approve ownership?**  
   *A:* Similarity scores are heuristic probabilities, not legal proof. Automated handover would introduce high vulnerability to theft. The AI assists discovery; human moderators verify private clues.
3. **Q: How does the system prevent QR code replay attacks?**  
   *A:* Handover tokens are stored as one-way HMAC-SHA-256 hashes with short expiration (24h). Once scanned and redeemed at the custody desk, the database marks `redeemed_at = NOW()`, causing any subsequent scan to be rejected immediately.

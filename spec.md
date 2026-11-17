



SMART LOST & FOUND INTELLIGENCE SYSTEM
Cloud-Based Campus Recovery Platform — Advanced 3D Edition
Project type: Cloud Computing Mini-Project | Level: 5th-semester CSE
Tagline: Lost Something? Let Intelligence Find It.
Version: 2.0
Principle: Complete a secure, working MVP first. Add AI, 3D and stretch features only after the core recovery workflow works.

1. Project Overview
Smart Lost & Found is a cloud-based campus platform where students and staff report belongings they have lost or found, upload photographs, describe items and locations, receive potential-match suggestions, submit private ownership claims, and coordinate secure handover through authorized moderators.

It combines a practical lost-and-found workflow with cloud-hosted compute, managed database, authentication, object storage, notifications, explainable matching, optional image similarity, campus analytics and a selective 3D user experience.

1.1 Problem Statement
Campus lost-and-found information is commonly scattered across class groups, notice boards, security desks and informal messages. Reports are difficult to search, people may not know when a matching item is found, and publicly sharing too much information can enable fraudulent ownership claims.

A centralized platform is needed to organize reports, suggest potential matches, protect private ownership evidence and provide a traceable recovery process.

1.2 Objectives
Centralize lost-and-found reporting.
Reduce the time required to identify potential matches.
Protect private ownership clues and contact information.
Provide moderator-controlled, traceable recovery.
Demonstrate real cloud-computing concepts.
Deliver an attractive, responsive and accessible application.
Keep the MVP feasible without special hardware.
1.3 Scope and Priority
MVP — must complete
Authentication, profiles and role-based access.
Lost/found report creation, editing and closure.
Image uploads to private cloud storage.
Search, pagination and category/date/location filters.
Explainable metadata/text matching.
Private claims and moderator review.
Handover confirmation and recovery history.
In-app notifications.
Admin dashboard with real aggregate data.
RLS, audit events, responsive design and deployment.
Advanced — after MVP
Optional image similarity.
Duplicate report warnings.
Saved searches / item watchlist.
Email notifications.
QR-assisted handover with expiring one-time token.
Approximate campus map / location heatmap.
Recovery analytics.
PWA installability.
Optional stretch goals
AI recovery assistant restricted to public help content.
Automatic category and colour suggestions from images.
Reward points for moderator-confirmed recovery.
Natural-language search.
Additional interface languages.
Vector search for image embeddings.
Do not include facial recognition, identity-document scanning, public exact storage locations or autonomous ownership approval.

2. Roles and Permissions
Role	Permissions
Visitor	View landing page and public-safe approved reports.
Student	Create reports, upload images, search, view own matches, submit claims, manage own reports and notifications.
Staff	Student permissions plus staff reporting workflows configured by the college.
Moderator	Review reports and claims, request evidence, approve/reject claims, coordinate handover and flag suspicious activity.
Admin	Manage roles, categories and campus zones; review audit events; view analytics and moderation settings.
Authorization rules:

Users edit or close only their own reports unless authorized as moderator/admin.
Claimants see only their own private claim details.
Moderators access claim evidence only under the moderation policy.
Public APIs never expose private claim answers, internal notes, personal contact details or exact secure holding locations.
Only authorized moderators/admins can approve claims and confirm handover.
Never trust a role or owner ID submitted by the browser. Derive identity from the verified session.
3. Functional Requirements
FR-01 Authentication and Profiles
Supabase Auth registration, login, logout and password reset.
Profile linked to authenticated user UUID.
Display name, campus email, role and optional department.
Protected routes and persistent sessions.
Server-side session/token verification for protected APIs.
FR-02 Lost Report
Fields: title, category, public description, approximate lost date/time, campus zone, optional colour/brand/public attributes, photos and private preferred contact method. A report starts as open and follows permitted status transitions.

FR-03 Found Report
Fields: generic item title, category, public-safe description, found date/time, approximate campus zone, photos and whether held by finder or deposited with an authorized office. Do not publish unique identifying clues; keep them private for verification.

FR-04 Browse and Search
Search title and public description.
Filter by report type, category, date and campus zone.
Sort newest/relevance and paginate.
Hide recovered/rejected/closed reports from default active results.
Apply privacy filtering before returning data.
FR-05 Explainable Potential Matching
For each new or updated report, compare eligible opposite-type reports.

Baseline formula:

score = 0.30*category + 0.25*text + 0.20*date + 0.15*location + 0.10*attributes

Each component is normalized to [0,1]. Store component scores and a safe explanation. Suggested labels:

80–100: Strong potential match.
60–79: Possible match.
Below 60: Do not prominently recommend.
These are configurable match-score bands, not probabilities. The UI must say “match score”, never “ownership probability”.

Matching rules:

Compare lost with found records only.
Exclude closed/recovered/rejected records.
Avoid meaningless self-matches.
Do not expose private attributes in explanations.
Allow users to dismiss irrelevant suggestions.
Require human ownership verification.
FR-06 Claims and Ownership Verification
User submits a claim against a found report or match.
Collect private identifying clues not displayed publicly.
Claim details and evidence are visible only to claimant and authorized moderators.
Moderator may request more information, approve or reject with reason.
Rate-limit repeated claims and audit decisions.
Matching score never auto-approves ownership.
FR-07 Secure Handover
Moderator coordinates a safe handover location/time.
Optional short-lived one-time token or QR is generated after approval.
QR contains an opaque random token only, never personal data.
Store token hash where practical; enforce expiry and single redemption.
Revoke token when claim is cancelled/rejected.
Record handover actor and timestamp.
Provide manual moderator confirmation if QR is unavailable.
FR-08 Notifications
In-app notifications for match suggestions, claim submission, evidence requests, claim decision, handover schedule and recovery. Email is advanced and requires a configured provider and verified sender. Do not report email as delivered without provider confirmation.

FR-09 Moderation and Admin
Review new/flagged reports.
Hide or reject inappropriate reports with a reason.
Review claims and handovers.
Manage categories and campus zones.
View audit events and aggregate analytics.
Suspend users only through authorized admin actions.
FR-10 Analytics
Display active lost/found reports, pending claims, recovered items, recovery rate, median/average recovery time, category counts, campus-zone counts and monthly trends. Define metric formulas. Never include private claim information in analytics.

4. Advanced Feature Specifications
4.1 Optional Image Similarity
Implement only after metadata matching is stable.

Upload image to private cloud storage.
Backend validates file and authorizes access.
Optional Python FastAPI service computes a pretrained image embedding.
Store the embedding or protected reference.
Compare vectors using cosine similarity.
Combine scores using a configurable formula, initially:
combined_score = 0.80 * metadata_score + 0.20 * visual_score

This is a heuristic to tune and test, not a probability. Similar-looking objects are not proof of ownership.

Fallback: If the image service is unavailable, continue metadata matching and show “Image comparison unavailable; using report details.” Report creation must not fail because AI is offline.

4.2 Duplicate Detection
Compare recent reports by same user, title, category, text and time/location window. Warn and offer the existing report; never silently discard.

4.3 Watchlist
Users save private search criteria such as category, colour, brand or campus zone. Create an in-app alert when a new report matches.

4.4 QR Handover
Use cryptographically secure random tokens, short expiry, one-time redemption, revocation on cancellation and audit events. Keep manual confirmation as fallback.

4.5 Campus Map
Use curated campus zones (library, cafeteria, auditorium), not required GPS collection. Display approximate markers only when safe. Never reveal exact item storage/holding location publicly.

4.6 Rewards
Optional points only after moderator-confirmed recovery. Prevent duplicate grants with a unique recovery-event reference. No cash redemption in MVP.

4.7 AI Recovery Assistant
If built, it may explain reporting, claims and handover steps or help phrase a public-safe description. It must not reveal private claims, decide ownership, impersonate moderators or invent report status.

5. Non-Functional Requirements
Area	Requirement
Usability	Clear forms, helpful validation, visible status and understandable match explanations.
Performance	Pagination, optimized thumbnails and lazy-loaded 3D.
Availability	Graceful fallback if optional AI/email is down.
Security	RLS, server-side authorization, private storage and secret management.
Privacy	Data minimization, private claims and public-safe report fields.
Accessibility	Keyboard support, semantic HTML, contrast, alt text and reduced motion.
Responsiveness	Usable at 320px mobile width through desktop.
Maintainability	Modular code, migrations and documented APIs.
Reliability	Retry-safe notifications and idempotent recovery actions.
Observability	Structured logs without secrets or private evidence.
6. Premium 3D UI/UX Specification
6.1 Design Direction
Build a modern campus SaaS product with a light-first visual system: neutral light backgrounds, dark readable text, controlled indigo/blue/teal accents, subtle gradients, selected glass surfaces, rounded cards, clear spacing and consistent typography.

6.2 Required Pages
Landing page.
Login and registration.
Student/staff dashboard.
Report lost item.
Report found item.
Browse/search.
Item detail.
Potential matches.
My reports.
Claims and claim detail.
Notifications.
Profile/settings.
Moderator workspace.
Admin dashboard and analytics.
6.3 3D Landing Page
Hero scene with floating keys, backpack, book, phone and watch.
Gentle rotation/drifting at different speeds.
Headline and clear “Report Lost Item” / “Browse Found Items” actions.
3D objects must not obscure text or controls.
Static illustration fallback when WebGL is unavailable.
6.4 Dashboard and Match Motion
Subtle entrance transitions for summary cards.
Count-up animation only after real values load.
Smooth route transitions.
Match score ring/bar animation.
Small status and notification transitions.
Avoid continuous motion in data tables.
6.5 Item and Admin Views
Accessible image viewer with optional gentle pointer tilt.
Lost/found comparison side by side on desktop, stacked on mobile.
Recharts for analytics.
Optional campus-zone visualization only when based on real configured zones.
Do not invent geographic boundaries or imply precision from approximate data.
6.6 UI Technology
React + Vite.
Tailwind CSS.
Framer Motion for component/page transitions.
Three.js + React Three Fiber + Drei for selected 3D scenes.
GSAP only for a small number of complex scroll sequences.
Recharts for charts.
Lucide React for icons.
6.7 3D Performance and Accessibility
Lazy-load 3D scenes.
Use low-poly models and compressed textures.
Cap device pixel ratio.
Pause/reduce animation when off-screen.
Provide static fallback for unsupported WebGL/low-power devices.
Respect prefers-reduced-motion.
Never make essential actions hover-only.
Keep forms, navigation and recovery workflow usable without 3D.
Test mobile and integrated-graphics laptops.
Avoid excessive particles, bloom, shadows and post-processing.
7. Technology Stack and Cloud Choices
Layer	Recommended technology	Purpose
Frontend	React + Vite	UI and routing
Styling	Tailwind CSS	Responsive design
Motion	Framer Motion	UI animation
3D	Three.js + React Three Fiber + Drei	Selected 3D scenes
Charts	Recharts	Analytics
Backend	Node.js + Express	REST API and business logic
Database	Supabase PostgreSQL	Structured data
Authentication	Supabase Auth	Identity/session
Storage	Supabase Storage private bucket	Item photos
Realtime	Supabase Realtime	Live updates
Optional AI	Python + FastAPI	Image embeddings
Hosting	Vercel + suitable Node host	Frontend/API
Use one primary backend; do not create microservices for the MVP. The Python image service is optional and should be added only after the core system works.

7.1 Low-Cost Deployment
Start with managed Supabase services and small optimized image uploads. Deploy the frontend and API to suitable hosting plans. Check current provider pricing, quotas, bandwidth, build limits, inactivity policies and terms before deployment. Free tiers and eligibility can change; do not promise that the complete system will remain free. Configure usage monitoring and alerts where available.

7.2 AWS Alternative
Static frontend: S3 + CloudFront.
Authentication: Cognito.
API: API Gateway + Lambda or a container host.
Database: DynamoDB or managed relational database.
Image storage: private S3 bucket with presigned URLs.
Email: SES; notifications: SNS where suitable.
Monitoring: CloudWatch.
Async jobs: SQS/EventBridge.
AWS is an alternative, not an extra required stack. Check account eligibility, pricing, quotas and regional availability.

8. System Architecture and Data Flow
Student / Staff / Moderator /Admin
React + Vite
Supabase Auth
Node + Express REST API
Supabase PostgreSQL
Private Supabase Storage
Matching Engine
In-app Notifications
Optional Email Provider
Python FastAPI ImageSimilarity
Supabase Realtime
optional
Realtime updates
New report flow
User signs in.
Frontend submits fields and image.
Backend verifies session, fields and file.
Image is stored in private cloud storage.
Report is inserted with authenticated owner ID.
Matching engine compares eligible opposite-type reports.
Match score/explanation and notifications are stored.
User sees the report and potential matches.
Claim-to-recovery flow
User selects a potential match.
User submits private ownership evidence.
Claim is stored in protected database fields.
Moderator reviews and may request more information.
Moderator approves/rejects with reason.
Approved claim may receive a one-time handover token.
Authorized handover actor verifies token or uses manual confirmation.
Recovery event and report status are recorded.
Relevant users receive notifications.
9. Database Schema
Use UUID primary keys, UTC timestamps, foreign keys, constraints and indexes. Create SQL migrations and test them.

9.1 profiles
id uuid PK (same as auth user ID), display_name text, campus_email text, role text, department text nullable, is_active boolean, created_at timestamptz, updated_at timestamptz.

9.2 categories
id uuid PK, name text unique, description text nullable, is_active boolean, created_at timestamptz.

9.3 campus_locations
id uuid PK, name text unique, zone_code text nullable, description text nullable, is_active boolean.

9.4 reports
id uuid PK, owner_id uuid FK profiles.id, report_type text (lost/found), title text, description_public text, category_id uuid FK, location_id uuid FK, event_at timestamptz, colour text nullable, brand text nullable, attributes_public jsonb nullable, private_notes text nullable, status text, held_by text nullable, created_at timestamptz, updated_at timestamptz, closed_at timestamptz nullable.

Private notes must never be returned by public report APIs.

9.5 report_images
id uuid PK, report_id uuid FK reports.id, storage_path text, mime_type text, file_size_bytes bigint, is_primary boolean, created_at timestamptz.

Store object paths, not permanent public URLs. Generate short-lived signed URLs after authorization.

9.6 matches
id uuid PK, lost_report_id uuid FK reports.id, found_report_id uuid FK reports.id, category_score numeric, text_score numeric, date_score numeric, location_score numeric, attribute_score numeric, visual_score numeric nullable, final_score numeric, explanation jsonb, status text, created_at timestamptz, updated_at timestamptz. Add unique constraint for each lost/found pair.

9.7 claims
id uuid PK, match_id uuid FK nullable, found_report_id uuid FK reports.id, claimant_id uuid FK profiles.id, private_answers jsonb, evidence_storage_path text nullable, status text, moderator_id uuid FK profiles.id nullable, moderator_note text nullable, decision_reason text nullable, created_at timestamptz, updated_at timestamptz.

Only claimant and authorized moderators can access private answers/evidence.

9.8 handover_tokens
id uuid PK, claim_id uuid FK claims.id, token_hash text unique, expires_at timestamptz, redeemed_at timestamptz nullable, created_by uuid FK profiles.id, created_at timestamptz.

9.9 notifications
id uuid PK, user_id uuid FK profiles.id, type text, title text, body_public text, related_report_id uuid nullable, related_claim_id uuid nullable, is_read boolean, created_at timestamptz.

Never put private claim evidence in notification text.

9.10 watchlists — advanced
id uuid PK, user_id uuid FK profiles.id, criteria jsonb, is_active boolean, created_at timestamptz.

9.11 audit_logs
id uuid PK, actor_id uuid FK profiles.id nullable, action text, entity_type text, entity_id uuid nullable, metadata_safe jsonb, created_at timestamptz.

Never log passwords, tokens, private answers or image contents.

Relationships
PROFILES
REPORTS
CATEGORIES
CAMPUS_LOCATIONS
REPORT_IMAGES
MATCHES
CLAIMS
HANDOVER_TOKENS
NOTIFICATIONS
WATCHLISTS
AUDIT_LOGS
creates
classifies
locates
contains
may_start
submits
authorizes
receives
saves
acts
10. REST API Plan
Protected routes require a verified authenticated session. Use consistent JSON responses and correct HTTP status codes.

Method	Endpoint	Purpose	Access
GET	/api/health	Health check	Public
GET	/api/me	Current profile	Authenticated
PATCH	/api/me	Update allowed profile fields	Own user
GET	/api/categories	Active categories	Public/auth
GET	/api/locations	Active campus zones	Public/auth
POST	/api/reports	Create report	Authenticated
GET	/api/reports	Browse/search	Public-safe/auth
GET	/api/reports/:id	Report detail	Policy-controlled
PATCH	/api/reports/:id	Update report	Owner/moderator
POST	/api/reports/:id/close	Close report	Owner/moderator
POST	/api/reports/:id/images	Upload flow	Authenticated owner
GET	/api/reports/:id/matches	Potential matches	Authorized
POST	/api/matches/:id/dismiss	Dismiss suggestion	Relevant user
POST	/api/claims	Submit claim	Authenticated
GET	/api/claims/mine	Own claims	Claimant
GET	/api/moderation/claims	Review queue	Moderator/admin
PATCH	/api/moderation/claims/:id	Request info/approve/reject	Moderator/admin
POST	/api/claims/:id/handover-token	Create token	Moderator/admin
POST	/api/handover/redeem	Redeem token	Authorized actor
POST	/api/handover/:claimId/confirm	Manual confirmation	Moderator/admin
GET	/api/notifications	Own notifications	Authenticated
PATCH	/api/notifications/:id/read	Mark own notification read	Owner
GET	/api/admin/analytics	Aggregate metrics	Admin
GET	/api/admin/audit-logs	Audit events	Admin
Example create-report body:

{
  "reportType": "lost",
  "title": "Black laptop sleeve",
  "description": "Black sleeve with a small blue sticker",
  "categoryId": "CATEGORY_UUID",
  "locationId": "LOCATION_UUID",
  "eventAt": "2026-11-15T09:30:00Z",
  "colour": "Black",
  "brand": "Unknown"
}
The server derives owner_id from the authenticated session, not from the request body.

Example match response:

{
  "matchId": "MATCH_UUID",
  "finalScore": 86,
  "label": "Strong potential match",
  "components": {
    "category": 1.0,
    "text": 0.82,
    "date": 0.9,
    "location": 0.8,
    "attributes": 0.75
  },
  "explanation": [
    "Both reports are in the electronics category",
    "Descriptions share relevant terms",
    "Reported dates are close"
  ],
  "notice": "A suggested match is not proof of ownership."
}
11. Matching Engine
MVP comparison:

Category: exact match or configured category hierarchy.
Text: normalized token overlap or TF-IDF cosine similarity.
Date: score decreases with elapsed time.
Location: same zone scores highest; nearby zones receive partial score only if adjacency is configured.
Attributes: compare public colour/brand/attributes.
Document the chosen date window, normalization and weights. Add unit tests with known examples.

Optional image path:

Pretrained image embedding.
Vector normalization.
Cosine similarity.
Recompute when image changes.
Apply retention and access policy to embeddings.
Keep image similarity optional.
If image service fails, continue metadata matching and record a safe diagnostic event. Do not block report creation.

12. Security, Privacy and Abuse Prevention
Authentication and authorization
Supabase Auth.
Verify tokens on protected APIs.
RLS on every exposed table.
Least-privilege policies.
Never accept role/owner ID from untrusted clients.
Service-role key server-side only and only where required.
Storage safeguards
Private bucket.
Allowlisted image MIME types.
Validate file signatures where feasible, not only filename extension.
Configurable upload-size limit.
Random object names.
Reject executable/unsupported files.
Short-lived signed URLs.
Consider stripping EXIF metadata.
Rate-limit uploads.
Privacy
Separate public descriptions from private verification clues.
Keep claims/evidence private.
Hide exact holding locations.
Minimize personal data.
Define retention/deletion rules with college guidance.
Keep notifications public-safe.
Abuse prevention
Rate-limit reports and claims.
Duplicate warnings.
Report flagging and moderation queue.
Audit all privileged status changes.
Enforce QR expiry and one-time use.
Require human moderator approval.
13. Deployment Architecture
Use separate development and production configuration. Never commit .env.

Frontend variables:

VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_API_BASE_URL
Backend variables:

PORT
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY (server only, only if needed)
APP_ORIGIN
EMAIL_PROVIDER_API_KEY (optional)
IMAGE_SERVICE_URL (optional)
HANDOVER_TOKEN_SECRET
Deployment sequence:

Create Supabase project.
Apply SQL migrations.
Configure RLS and test denial cases.
Create private storage bucket and policies.
Configure Auth redirect URLs.
Run frontend/backend locally.
Configure CORS for exact frontend origin.
Deploy backend.
Deploy frontend.
Set secrets in hosting environment.
Test authentication, upload, claims, roles and recovery in production.
Configure logs and usage monitoring.
Document backup/export and recovery approach.
Check current prices, quotas, bandwidth, inactivity rules and terms before selecting free tiers. Never commit secrets to GitHub.

14. Cloud Computing Concepts Demonstrated
Cloud concept	Implementation	Why it qualifies
SaaS-style access	Hosted campus web app	Users access a centrally hosted application over a network.
DBaaS	Supabase PostgreSQL	Managed cloud database.
Object storage	Supabase Storage / S3	Images stored as cloud objects, not only on a laptop.
Authentication as a service	Supabase Auth / Cognito	Managed identity service.
PaaS/hosted compute	Deployed Express API	Backend runs on hosted infrastructure.
Serverless (optional)	Function for notifications/image jobs	Event-driven on-demand compute.
Realtime	Supabase Realtime	Cloud data changes delivered to connected clients.
Elasticity/scaling	Stateless API, managed services, indexes	Capacity can be adjusted subject to provider limits.
Monitoring	Cloud logs/metrics	Centralized service observability.
Cloud security	RLS, signed URLs, secrets and role controls	Access to cloud resources is governed.
Async processing	Queue for image/email jobs	Background processing is decoupled from user requests.
React, CSS, 3D animation and the matching formula are application features, not by themselves proof of cloud computing. Demonstrate the deployed API, managed database, cloud storage, hosted authentication, network communication, security policies and monitoring.

15. Testing Strategy
Test types:

Unit: matching scores, validators and status transitions.
Integration: auth, reports, claims, notifications.
Database: constraints, foreign keys and RLS.
Storage: file validation and private access.
End-to-end: report → match → claim → approval → recovery.
Security: unauthorized access, IDOR, role escalation and QR replay.
UI: mobile layout, keyboard navigation and reduced motion.
Performance: pagination, image optimization and basic load checks.
ID	Test	Expected result
TC-01	Register with valid campus email	Account and profile created.
TC-02	Open protected dashboard while logged out	Redirect/401; no protected data.
TC-03	Create valid lost report	Saved with authenticated owner ID.
TC-04	Upload unsupported file	Rejected with clear error.
TC-05	Unauthorized user requests private image	Denied.
TC-06	Create similar lost/found records	Match and explanation generated.
TC-07	Image service unavailable	Metadata matching still works.
TC-08	User reads another user's claim	Denied.
TC-09	Student calls moderator endpoint	403/denied.
TC-10	Moderator approves claim	Status changes and audit event recorded.
TC-11	Redeem same QR twice	First succeeds; second rejected.
TC-12	Redeem expired token	Rejected.
TC-13	Confirm recovery	Report/claim statuses update consistently.
TC-14	Open at 320px width	No clipped primary actions/page overflow.
TC-15	Enable reduced-motion preference	Non-essential animation reduced/disabled.
16. Demonstration Scenarios
Scenario A — Potential Match
Student A reports a lost black wireless earbud case near the library.
Student B reports a similar found case near the library.
Matching engine calculates score and explanations.
Student A receives an in-app suggestion.
Student A submits private ownership clues.
Scenario B — Secure Recovery
Moderator opens the claim queue.
Moderator checks private evidence.
Moderator requests clarification or approves.
One-time handover token is generated.
Moderator validates it during handover.
Item is marked recovered.
Users receive notifications and analytics update.
Scenario C — Cloud Demonstration
Show the deployed frontend URL, backend health endpoint, Supabase Auth session, PostgreSQL report row, private storage object, RLS denial test, realtime notification and cloud logs/metrics.

Scenario D — 3D Demonstration
Show the 3D landing hero, responsive dashboard, animated match indicator, mobile fallback and reduced-motion mode.

17. Implementation Roadmap
A realistic schedule is 5–7 weeks depending on available time.

Phase	Work	Exit deliverable
0	Repository inspection, React/Vite, Express, Supabase setup	Running skeleton
1	Auth, profiles, roles and protected routes	Secure login
2	Categories, locations, reports and private image storage	Working reports
3	Browse, filters and baseline matching	Match suggestions
4	Claims, moderation and recovery	End-to-end recovery
5	Notifications, analytics and audit logs	Complete MVP
6	UI polish, 3D hero, transitions and responsive QA	Premium interface
7	Image similarity, watchlist and QR handover	Advanced demo
8	Testing, security review, deployment and docs	Final submission
Do not move to the next phase until the current phase works with real database data, authorization is tested, loading/error states exist, and setup instructions are documented.

18. Suggested Repository Structure
smart-lost-found/
├── client/
│   ├── public/
│   │   ├── models/
│   │   └── images/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── common/
│       │   ├── forms/
│       │   ├── layout/
│       │   ├── reports/
│       │   ├── matches/
│       │   ├── dashboard/
│       │   └── three/
│       ├── pages/
│       ├── routes/
│       ├── hooks/
│       ├── services/
│       ├── context/
│       ├── utils/
│       └── styles/
├── server/
│   └── src/
│       ├── config/
│       ├── middleware/
│       ├── routes/
│       ├── controllers/
│       ├── services/
│       ├── validators/
│       ├── jobs/
│       └── utils/
├── image-service/          # Optional FastAPI service
├── supabase/
│   ├── migrations/
│   └── seed.sql             # Categories and campus zones only
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── TESTING.md
│   └── DEPLOYMENT.md
├── .gitignore
├── README.md
└── spec.md
19. Risks and Mitigations
Risk	Mitigation
Image matching inaccurate	Treat as suggestion; retain metadata fallback and human verification.
3D page slow	Lazy-load, low-poly assets, cap DPR and provide static fallback.
Cloud quota exceeded	Compress images, paginate, monitor usage and check current limits.
Unauthorized claim access	RLS, server authorization and negative tests.
Fraudulent claims	Private clues, rate limits, moderator approval and audit trail.
Email unavailable	Keep in-app notifications as MVP path.
QR replay	Expiry, one-time redemption and server validation.
Scope too large	Complete MVP first and defer stretch goals.
Sensitive location exposed	Approximate zones and role-protected holding details.
Optional service outage	Graceful fallback and clear status message.
20. Expected Outcomes and Success Criteria
The final application should provide:

A working campus lost-and-found portal.
Secure, explainable potential matching.
Private claims and moderator-controlled recovery.
Cloud database, authentication, storage and hosted API.
Admin analytics from real records.
Responsive UI with selective 3D animation.
Optional image similarity and QR handover.
Test evidence, deployment guide and project documentation.
MVP success: A user can register, report an item with a photo, discover a potential match, submit private ownership evidence, receive moderator approval and complete a recorded recovery. Unauthorized users cannot access private claims or restricted actions.

21. Project Report Structure
Introduction
Problem Statement and Existing System
Proposed System and Objectives
Literature Survey
Requirements Analysis
System Architecture and Cloud Service Model
Database Design
Module Design and Implementation
Security and Privacy
Testing and Results
Deployment and Cloud Demonstration
Conclusion and Future Enhancements
References
22. PPT Structure
Title and team details
Problem statement
Existing system limitations
Proposed solution
Objectives and scope
Technology stack
Cloud architecture
Database design
Core workflows
Matching algorithm
3D UI/UX highlights
Security and privacy
Testing results
Live demo
Cloud computing concepts demonstrated
Limitations and future scope
Conclusion
23. Viva Preparation
Be ready to explain:

Why this is a cloud application.
Cloud object storage versus local file storage.
Why PostgreSQL is used.
Authentication versus authorization.
What RLS does.
How match score is calculated.
Why a match score is not ownership proof.
How image similarity works at a high level.
Why AI is optional.
How QR expiry and one-time use prevent replay.
How the app behaves if an optional service is unavailable.
How 3D assets are optimized for mobile.
24. Final Instructions for the Coding Assistant
Treat this document as the single source of truth.

Inspect the repository before editing.
Confirm the stack and current project state.
Create a phase-by-phase checklist.
Implement Phase 0 and Phase 1 first.
Do not generate the entire application in one pass.
For every phase, list changed files, explain configuration, provide exact commands and run tests.
Use real database operations; do not fake successful features with static data.
Keep secrets out of frontend code and Git.
Preserve RLS and private storage policies.
Test access denial as carefully as successful access.
Build the complete MVP before AI, rewards or advanced 3D.
Keep 3D separate from essential workflows.
Document any deviation and explain why.
START: Inspect this specification and the repository. Report the implementation plan, folder structure and setup commands. Then implement Phase 0 — Project Setup. Do not skip planning or begin advanced features before the MVP foundation is secure.





⋮⋮⋮⋮
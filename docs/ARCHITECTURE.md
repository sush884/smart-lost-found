# System Architecture & Cloud Service Model
## Smart Lost & Found Intelligence System

### 1. High-Level Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                              CLIENT LAYER (Browser)                               |
|                                                                                   |
|  +---------------------+  +----------------------+  +--------------------------+  |
|  |   React 18 / Vite   |  | Three.js / R3F Scene |  | Framer Motion Animations |  |
|  +---------------------+  +----------------------+  +--------------------------+  |
|  |   Tailwind CSS UI   |  | Recharts Dashboards  |  | QRCode SVG Generator     |  |
|  +---------------------+  +----------------------+  +--------------------------+  |
+------------------------------------------+----------------------------------------+
                                           | HTTPS / JSON
                                           v
+-----------------------------------------------------------------------------------+
|                        APPLICATION SERVER LAYER (Hosted API)                      |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | Express.js Server (Node.js ESM)                                             |  |
|  | - Security Headers (Helmet)                                                 |  |
|  | - Rate Limiter (express-rate-limit)                                         |  |
|  | - Bearer JWT Verification Middleware                                        |  |
|  | - Role-Based Access Control (RBAC: Student, Staff, Moderator, Admin)        |  |
|  | - Zod Input Validation & Sanitization                                       |  |
|  | - Heuristic Matching Engine & Duplicate Detection                           |  |
|  | - Cryptographic Token Generation & SHA-256 Redemption Verification         |  |
|  +-----------------------------------------------------------------------------+  |
+------------------------------------------+----------------------------------------+
                                           | Supabase SDK / REST
                                           v
+-----------------------------------------------------------------------------------+
|                       CLOUD SERVICES LAYER (Supabase Cloud)                       |
|                                                                                   |
|  +-----------------------+  +-----------------------+  +-----------------------+  |
|  |     Supabase Auth     |  |  PostgreSQL Database  |  |   Supabase Storage    |  |
|  |  - JWT Session tokens |  |  - 11 Relational tbls |  |  - Private bucket     |  |
|  |  - Auth user metadata |  |  - Row Level Security |  |  - 5MB file cap       |  |
|  |  - Profile sync trig. |  |  - Audit event logs   |  |  - 1-hour signed URLs |  |
|  +-----------------------+  +-----------------------+  +-----------------------+  |
+-----------------------------------------------------------------------------------+
```

---

### 2. Cloud Computing Concepts Demonstrated

| Concept | Implementation | Qualification in Viva / Evaluation |
| :--- | :--- | :--- |
| **SaaS Model** | Web client hosted in the cloud | Accessible campus-wide from any device without local installation. |
| **Database-as-a-Service (DBaaS)** | Supabase Managed PostgreSQL | Cloud-provisioned relational database with indexing, triggers, and automated backups. |
| **Object Storage** | Supabase Storage Private Bucket | Media objects stored independently of the compute instance with presigned URLs. |
| **Authentication-as-a-Service** | Supabase Auth (GoTrue) | Delegated identity and access management with cryptographically signed JWTs. |
| **Platform-as-a-Service (PaaS)** | Hosted Express REST API | Scalable compute environment decoupled from client rendering and storage. |
| **Cloud Security Architecture** | PostgreSQL Row-Level Security (RLS) | Security enforced at the database layer; unauthorized queries fail regardless of API route. |
| **Centralized Observability** | Structured Audit Logs (`public.audit_logs`) | Real-time security telemetry recording actions, actors, and non-sensitive metadata. |

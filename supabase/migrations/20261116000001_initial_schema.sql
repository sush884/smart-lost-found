-- ============================================================================
-- SMART LOST & FOUND INTELLIGENCE SYSTEM
-- Cloud-Based Campus Recovery Platform
-- Initial Database Migration (PostgreSQL / Supabase)
-- ============================================================================

-- Enable pgcrypto / uuid-ossp for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    campus_email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'staff', 'moderator', 'admin')),
    department TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index on email and role
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_campus_email ON public.profiles(campus_email);

-- ----------------------------------------------------------------------------
-- 2. CATEGORIES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 3. CAMPUS LOCATIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.campus_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    zone_code TEXT,
    description TEXT,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 4. REPORTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    report_type TEXT NOT NULL CHECK (report_type IN ('lost', 'found')),
    title TEXT NOT NULL,
    description_public TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    location_id UUID NOT NULL REFERENCES public.campus_locations(id) ON DELETE RESTRICT,
    event_at TIMESTAMPTZ NOT NULL,
    colour TEXT,
    brand TEXT,
    attributes_public JSONB DEFAULT '{}'::jsonb,
    private_notes TEXT,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'matched', 'claimed', 'recovered', 'closed', 'rejected')),
    held_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    closed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_reports_type_status ON public.reports(report_type, status);
CREATE INDEX IF NOT EXISTS idx_reports_owner ON public.reports(owner_id);
CREATE INDEX IF NOT EXISTS idx_reports_category ON public.reports(category_id);
CREATE INDEX IF NOT EXISTS idx_reports_location ON public.reports(location_id);
CREATE INDEX IF NOT EXISTS idx_reports_event_at ON public.reports(event_at DESC);

-- ----------------------------------------------------------------------------
-- 5. REPORT IMAGES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.report_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_report_images_report ON public.report_images(report_id);

-- ----------------------------------------------------------------------------
-- 6. MATCHES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lost_report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
    found_report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
    category_score NUMERIC(5, 4) NOT NULL DEFAULT 0.0,
    text_score NUMERIC(5, 4) NOT NULL DEFAULT 0.0,
    date_score NUMERIC(5, 4) NOT NULL DEFAULT 0.0,
    location_score NUMERIC(5, 4) NOT NULL DEFAULT 0.0,
    attribute_score NUMERIC(5, 4) NOT NULL DEFAULT 0.0,
    visual_score NUMERIC(5, 4),
    final_score NUMERIC(5, 2) NOT NULL,
    explanation JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'suggested' CHECK (status IN ('suggested', 'reviewed', 'dismissed', 'claimed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_lost_found_match UNIQUE (lost_report_id, found_report_id)
);

CREATE INDEX IF NOT EXISTS idx_matches_lost ON public.matches(lost_report_id);
CREATE INDEX IF NOT EXISTS idx_matches_found ON public.matches(found_report_id);
CREATE INDEX IF NOT EXISTS idx_matches_score ON public.matches(final_score DESC);

-- ----------------------------------------------------------------------------
-- 7. CLAIMS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES public.matches(id) ON DELETE SET NULL,
    found_report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
    claimant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    private_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    evidence_storage_path TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'info_requested', 'approved', 'rejected', 'cancelled')),
    moderator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    moderator_note TEXT,
    decision_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_claims_claimant ON public.claims(claimant_id);
CREATE INDEX IF NOT EXISTS idx_claims_found_report ON public.claims(found_report_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON public.claims(status);

-- ----------------------------------------------------------------------------
-- 8. HANDOVER TOKENS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.handover_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id UUID NOT NULL REFERENCES public.claims(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    redeemed_at TIMESTAMPTZ,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_handover_tokens_claim ON public.handover_tokens(claim_id);
CREATE INDEX IF NOT EXISTS idx_handover_tokens_hash ON public.handover_tokens(token_hash);

-- ----------------------------------------------------------------------------
-- 9. NOTIFICATIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body_public TEXT NOT NULL,
    related_report_id UUID REFERENCES public.reports(id) ON DELETE SET NULL,
    related_claim_id UUID REFERENCES public.claims(id) ON DELETE SET NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- ----------------------------------------------------------------------------
-- 10. WATCHLISTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.watchlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    criteria JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_watchlists_user ON public.watchlists(user_id);

-- ----------------------------------------------------------------------------
-- 11. AUDIT LOGS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    metadata_safe JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ----------------------------------------------------------------------------
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.handover_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is moderator or admin
CREATE OR REPLACE FUNCTION public.is_staff_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('moderator', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can view all active profiles, but only edit their own
CREATE POLICY "Public profiles are viewable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (TRUE);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Categories & Locations: Publicly viewable by anyone, editable only by admin
CREATE POLICY "Categories viewable by everyone"
    ON public.categories FOR SELECT
    TO public
    USING (is_active = TRUE);

CREATE POLICY "Locations viewable by everyone"
    ON public.campus_locations FOR SELECT
    TO public
    USING (is_active = TRUE);

-- Reports: Public-safe viewable if not rejected/closed, full access for owner/moderator
CREATE POLICY "Active reports are viewable by authenticated users"
    ON public.reports FOR SELECT
    TO authenticated
    USING (
        status NOT IN ('rejected') OR
        auth.uid() = owner_id OR
        public.is_staff_or_admin()
    );

CREATE POLICY "Authenticated users can create reports"
    ON public.reports FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners and moderators can update reports"
    ON public.reports FOR UPDATE
    TO authenticated
    USING (auth.uid() = owner_id OR public.is_staff_or_admin())
    WITH CHECK (auth.uid() = owner_id OR public.is_staff_or_admin());

-- Report Images: Viewable if corresponding report is viewable
CREATE POLICY "Report images viewable by authenticated users"
    ON public.report_images FOR SELECT
    TO authenticated
    USING (TRUE);

CREATE POLICY "Report owners can insert images"
    ON public.report_images FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.reports
            WHERE id = report_id AND owner_id = auth.uid()
        )
    );

-- Matches: Viewable by owners of either the lost or found report, or staff/admin
CREATE POLICY "Matches viewable by report owners and moderators"
    ON public.matches FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.reports
            WHERE (id = lost_report_id OR id = found_report_id) AND owner_id = auth.uid()
        ) OR public.is_staff_or_admin()
    );

-- Claims: Strict privacy! Only claimant and moderators can view
CREATE POLICY "Claims viewable only by claimant or moderator"
    ON public.claims FOR SELECT
    TO authenticated
    USING (auth.uid() = claimant_id OR public.is_staff_or_admin());

CREATE POLICY "Authenticated users can create claims"
    ON public.claims FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = claimant_id);

CREATE POLICY "Claimants can update pending claims, moderators can update any"
    ON public.claims FOR UPDATE
    TO authenticated
    USING (
        (auth.uid() = claimant_id AND status = 'pending') OR
        public.is_staff_or_admin()
    );

-- Handover Tokens: Only moderators/admins can manage handover tokens
CREATE POLICY "Handover tokens managed by moderators or claimants"
    ON public.handover_tokens FOR SELECT
    TO authenticated
    USING (
        public.is_staff_or_admin() OR
        EXISTS (
            SELECT 1 FROM public.claims
            WHERE id = claim_id AND claimant_id = auth.uid()
        )
    );

-- Notifications: Only visible to the target user
CREATE POLICY "Users can only view their own notifications"
    ON public.notifications FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
    ON public.notifications FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

-- Watchlists: Only visible to the owner
CREATE POLICY "Users view their own watchlists"
    ON public.watchlists FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Audit Logs: Viewable only by admins
CREATE POLICY "Audit logs viewable only by admins"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ----------------------------------------------------------------------------
-- 13. AUTOMATIC PROFILE CREATION TRIGGER
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, campus_email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'student')
    )
    ON CONFLICT (id) DO UPDATE
    SET display_name = EXCLUDED.display_name,
        campus_email = EXCLUDED.campus_email;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

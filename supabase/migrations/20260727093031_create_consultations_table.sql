/*
# Create consultations table

1. New Tables
- `consultations`
  - `id` (uuid, primary key, auto-generated)
  - `stakeholder_name` (text, not null) — full name of the person requesting the consultation
  - `stakeholder_email` (text, not null) — email address for follow-up
  - `stakeholder_phone` (text, not null) — phone number
  - `meeting_type` (text, not null) — "virtual" or "onsite"
  - `site_address` (text, not null) — property address for the consultation
  - `preferred_date` (text, not null) — requested date in YYYY-MM-DD format
  - `preferred_time` (text, not null) — requested time in HH:MM 24h format
  - `base_fee` (integer, not null, default 15000) — base consultation fee in cents
  - `growth_fund` (integer, not null, default 0) — 10% growth fund addition in cents
  - `travel_surcharge` (integer, not null, default 0) — travel cost for on-site visits beyond 30 miles
  - `total_price` (integer, not null, default 0) — total amount charged via Stripe
  - `status` (text, not null, default 'pending_payment') — tracks payment and scheduling state
  - `created_at` (timestamptz, default now()) — when the consultation was requested

2. Security
- Enable RLS on `consultations`.
- Allow anon + authenticated to insert (the voice assistant submits on behalf of visitors).
- Allow anon + authenticated to select (so the success page can look up a consultation by ID).
- No update or delete from the client — those are managed server-side only.
*/

CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stakeholder_name text NOT NULL,
  stakeholder_email text NOT NULL,
  stakeholder_phone text NOT NULL,
  meeting_type text NOT NULL CHECK (meeting_type IN ('virtual', 'onsite')),
  site_address text NOT NULL,
  preferred_date text NOT NULL,
  preferred_time text NOT NULL,
  base_fee integer NOT NULL DEFAULT 15000,
  growth_fund integer NOT NULL DEFAULT 0,
  travel_surcharge integer NOT NULL DEFAULT 0,
  total_price integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending_payment',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_consultations" ON consultations;
CREATE POLICY "anon_insert_consultations" ON consultations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_consultations" ON consultations;
CREATE POLICY "anon_select_consultations" ON consultations FOR SELECT
  TO anon, authenticated USING (true);

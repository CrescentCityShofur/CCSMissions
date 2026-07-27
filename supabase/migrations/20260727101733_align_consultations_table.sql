/*
# Align consultations table with CCS Missions booking flow

1. Modified Tables
- `consultations`
  - Drop existing check constraint on `meeting_type` (was 'short', 'long', 'coastal')
  - Add new check constraint on `meeting_type` for 'virtual', 'onsite'
  - Add `base_fee` (integer, default 15000) — base consultation fee in cents
  - Add `growth_fund` (integer, default 0) — 10% growth fund addition in cents
  - Add `travel_surcharge` (integer, default 0) — travel cost for on-site visits beyond 30 miles
  - Add `total_price` (integer, default 0) — total amount charged via Stripe
  - Add `status` (text, default 'pending_payment') — tracks payment and scheduling state

2. Security
- No RLS policy changes. Existing anon insert/select policies remain in place.

3. Notes
- The table had 0 rows at migration time, so no data is affected.
- Existing columns (preferred_date as date, preferred_time as time, price as numeric, distance_miles, stripe_checkout_url, paid) are retained and will be used by the updated API route.
*/

ALTER TABLE consultations DROP CONSTRAINT IF EXISTS consultations_meeting_type_check;

ALTER TABLE consultations ADD CONSTRAINT consultations_meeting_type_check
  CHECK (meeting_type IN ('virtual', 'onsite'));

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'consultations' AND column_name = 'base_fee') THEN
    ALTER TABLE consultations ADD COLUMN base_fee integer NOT NULL DEFAULT 15000;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'consultations' AND column_name = 'growth_fund') THEN
    ALTER TABLE consultations ADD COLUMN growth_fund integer NOT NULL DEFAULT 0;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'consultations' AND column_name = 'travel_surcharge') THEN
    ALTER TABLE consultations ADD COLUMN travel_surcharge integer NOT NULL DEFAULT 0;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'consultations' AND column_name = 'total_price') THEN
    ALTER TABLE consultations ADD COLUMN total_price integer NOT NULL DEFAULT 0;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'consultations' AND column_name = 'status') THEN
    ALTER TABLE consultations ADD COLUMN status text NOT NULL DEFAULT 'pending_payment';
  END IF;
END $$;

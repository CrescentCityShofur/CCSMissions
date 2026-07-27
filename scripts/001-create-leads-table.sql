-- CCS Missions: lead capture from Taylor Made conversations
CREATE TABLE IF NOT EXISTS ccs_leads (
  id                    SERIAL PRIMARY KEY,
  created_at            TIMESTAMPTZ  NOT NULL DEFAULT now(),
  full_name             TEXT,
  email                 TEXT,
  phone                 TEXT,
  location              TEXT,
  property_type         TEXT,
  primary_needs         TEXT,
  timeline              TEXT,
  budget                TEXT,
  hurricane_interest    TEXT,
  notes                 TEXT,
  specialists_consulted TEXT[]       NOT NULL DEFAULT '{}',
  summary               TEXT,
  transcript            JSONB        NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS ccs_leads_created_at_idx ON ccs_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS ccs_leads_email_idx ON ccs_leads (email);

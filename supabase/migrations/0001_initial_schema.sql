-- Job Specs (The parsed requirements from the user)
CREATE TABLE job_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, -- References auth.users later
  title TEXT NOT NULL,
  inventory_json JSONB NOT NULL,
  origin_address TEXT,
  destination_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quotes (The itemized bids extracted by the ElevenLabs Agent)
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_spec_id UUID REFERENCES job_specs(id) ON DELETE CASCADE,
  vendor_name TEXT NOT NULL,
  base_fee NUMERIC DEFAULT 0,
  stairs_fee NUMERIC DEFAULT 0,
  long_carry_fee NUMERIC DEFAULT 0,
  total_price NUMERIC NOT NULL,
  is_red_flag BOOLEAN DEFAULT FALSE,
  audio_receipt_url TEXT,
  call_transcript TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

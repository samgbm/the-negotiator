-- Access flags confirmed during AI clarification
ALTER TABLE job_specs
  ADD COLUMN IF NOT EXISTS has_stairs BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS long_carry BOOLEAN NOT NULL DEFAULT FALSE;

-- Migration: Add saving_throws_override field to characters table
-- Description: Allows manual override of saving throws values
-- Created: 2026-04-13

-- Add saving_throws_override field (JSONB)
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS saving_throws_override JSONB DEFAULT '{}'::jsonb;

-- Add comment
COMMENT ON COLUMN characters.saving_throws_override IS 'Manual overrides for saving throws (e.g., {"str": 5, "dex": 3}). Empty object means use automatic calculation.';

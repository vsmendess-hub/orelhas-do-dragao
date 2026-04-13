-- Migration: Add skill_overrides field to characters table
-- Description: Allows manual override of skill values
-- Created: 2026-04-13

-- Add skill_overrides field (JSONB)
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS skill_overrides JSONB DEFAULT '{}'::jsonb;

-- Add comment
COMMENT ON COLUMN characters.skill_overrides IS 'Manual overrides for skill bonuses (e.g., {"athletics": 5, "stealth": 8}). Empty object means use automatic calculation.';

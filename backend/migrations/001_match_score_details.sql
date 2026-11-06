-- LLM match assessment: sub-scores, matched/missing skills and reason.
-- Nullable: rows created before this migration (and the old backend) keep working.
ALTER TABLE public.match_scores ADD COLUMN IF NOT EXISTS details JSONB;

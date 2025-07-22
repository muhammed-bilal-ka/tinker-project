-- Migration: Convert boolean status to text moderation status for reviews
-- 1. Add a new text column for status
ALTER TABLE reviews ADD COLUMN status_text text;

-- 2. Migrate boolean values to text
UPDATE reviews SET status_text = CASE
  WHEN status = true THEN 'accepted'
  WHEN status = false THEN 'rejected'
  ELSE 'pending'
END;

-- 3. Drop the old boolean column
ALTER TABLE reviews DROP COLUMN status;

-- 4. Rename the new column to 'status'
ALTER TABLE reviews RENAME COLUMN status_text TO status;


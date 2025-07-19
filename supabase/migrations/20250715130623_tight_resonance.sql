/*
  # Fix College Reviews Foreign Key Constraint

  This migration fixes the foreign key relationship between college_reviews and user_profiles
  with the correct table and column names.

  ## Changes
  1. Drop any existing foreign key constraint on college_reviews.user_id
  2. Add new foreign key constraint from college_reviews.user_id to user_profiles.user_id
  
  ## Notes
  - college_reviews table references user_profiles table
  - user_profiles.user_id is the primary key (renamed from id)
  - No unique constraint needed since user_id is already the primary key
*/

-- Step 1: Drop any existing foreign key constraint on college_reviews.user_id
DO $$
BEGIN
    -- Check if the constraint exists and drop it
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'college_reviews_user_id_fkey' 
        AND table_name = 'college_reviews'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.college_reviews
        DROP CONSTRAINT college_reviews_user_id_fkey;
    END IF;
    
    -- Also check for any other user_id foreign key constraints
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'reviews_user_id_fkey' 
        AND table_name = 'college_reviews'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.college_reviews
        DROP CONSTRAINT reviews_user_id_fkey;
    END IF;
END $$;

-- Step 2: Add the correct foreign key constraint
-- college_reviews.user_id should reference user_profiles.user_id (which is the primary key)
ALTER TABLE public.college_reviews
ADD CONSTRAINT college_reviews_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.user_profiles(user_id) ON DELETE CASCADE;

-- Step 3: Verify the constraint was created successfully
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'college_reviews_user_id_fkey' 
        AND table_name = 'college_reviews'
        AND table_schema = 'public'
    ) THEN
        RAISE NOTICE 'SUCCESS: Foreign key constraint college_reviews_user_id_fkey created successfully!';
    ELSE
        RAISE EXCEPTION 'FAILED: Foreign key constraint was not created!';
    END IF;
END $$;
-- supabase/migrations/20250715_fix_reviews_user_profile_fk.sql

-- Step 1: Add a UNIQUE constraint to user_profiles.user_id
-- This ensures that user_profiles.user_id can be referenced by a foreign key
-- This step will fail if there are existing duplicate user_id values in user_profiles
ALTER TABLE public.user_profiles
ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);

-- Step 2: Drop the existing foreign key constraint on reviews.user_id
-- This is necessary if a previous, incorrect foreign key was created
-- This DO block ensures the script doesn't fail if the constraint doesn't exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reviews_user_id_fkey' AND conrelid = 'public.college_reviews'::regclass) THEN
        ALTER TABLE public.college_reviews
        DROP CONSTRAINT reviews_user_id_fkey;
    END IF;
END
$$;

-- Step 3: Add the new foreign key constraint from reviews.user_id to user_profiles.user_id
-- This references the now-unique user_profiles.user_id
ALTER TABLE public.college_reviews
ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(user_id) ON DELETE CASCADE;
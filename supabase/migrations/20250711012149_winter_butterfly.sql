/*
  # Fix Reviews Foreign Key Relationship

  1. Tables
    - Fix foreign key relationship between reviews and user_profiles
    - Ensure proper referential integrity

  2. Security
    - Maintain existing RLS policies
    - Ensure proper access controls
*/

-- First, let's make sure the user_profiles table references auth.users properly
DO $$
BEGIN
  -- Add foreign key constraint from user_profiles to auth.users if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_profiles_user_id_fkey' 
    AND table_name = 'user_profiles'
  ) THEN
    ALTER TABLE user_profiles 
    ADD CONSTRAINT user_profiles_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Now fix the reviews table foreign key to reference user_profiles
DO $$
BEGIN
  -- Drop existing foreign key if it exists and points to wrong table
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'reviews_user_id_fkey' 
    AND table_name = 'reviews'
  ) THEN
    ALTER TABLE reviews DROP CONSTRAINT reviews_user_id_fkey;
  END IF;

  -- Add correct foreign key constraint from reviews to user_profiles
  ALTER TABLE reviews 
  ADD CONSTRAINT reviews_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE;
END $$;
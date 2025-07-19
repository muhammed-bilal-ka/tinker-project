```sql
-- Add a UNIQUE constraint to the user_id column in the user_profiles table.
-- This is necessary for it to be referenced by a foreign key.
ALTER TABLE public.user_profiles
ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);

-- Drop the existing foreign key constraint on the 'reviews' table
-- that references the 'users' table.
ALTER TABLE public.reviews
DROP CONSTRAINT reviews_user_id_fkey;

-- Add the new foreign key constraint on the 'reviews' table
-- to reference the 'user_id' column in the 'user_profiles' table.
ALTER TABLE public.reviews
ADD CONSTRAINT reviews_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.user_profiles(user_id) ON DELETE CASCADE;
```
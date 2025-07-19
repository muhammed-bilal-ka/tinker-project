```sql
-- Add unique constraint to user_profiles.user_id
-- This ensures that each user has only one profile entry, which is necessary for foreign key referencing.
ALTER TABLE public.user_profiles
ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);

-- Drop the old foreign key from reviews to auth.users
-- This constraint is no longer needed as reviews will now directly reference user_profiles.
ALTER TABLE public.reviews
DROP CONSTRAINT reviews_user_id_fkey;

-- Add new foreign key from reviews to user_profiles.user_id
-- This establishes a direct and correct relationship between reviews and user profiles.
ALTER TABLE public.reviews
ADD CONSTRAINT reviews_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.user_profiles(user_id) ON DELETE CASCADE;
```
-- Fix Reviews Table Structure
-- This ensures the reviews table exists and has proper structure

-- 1. Check if reviews table exists
SELECT 'Checking reviews table:' as info;
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'reviews'
) as table_exists;

-- 2. Drop the table if it exists and recreate it properly
DROP TABLE IF EXISTS public.reviews CASCADE;

-- 3. Create reviews table with proper structure
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id uuid NOT NULL,
  user_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT fk_reviews_colleges
    FOREIGN KEY (college_id)
    REFERENCES public.colleges(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_reviews_user_profiles
    FOREIGN KEY (user_id)
    REFERENCES public.user_profiles(user_id)
    ON DELETE CASCADE
);

-- 4. Enable RLS on reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for reviews
CREATE POLICY "Anyone can read reviews"
  ON public.reviews
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON public.reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reviews"
  ON public.reviews
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own reviews"
  ON public.reviews
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_college_id ON public.reviews(college_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);

-- 7. Create unique constraint to prevent duplicate reviews
CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_unique_user_college 
ON public.reviews(college_id, user_id);

-- 8. Insert some sample reviews (optional - for testing)
-- Uncomment the lines below if you want sample data:
/*
INSERT INTO public.reviews (college_id, user_id, rating, review_text) VALUES
(
  (SELECT id FROM public.colleges LIMIT 1),
  '9031de15-ece0-4acc-ab29-754db2352b82',
  5,
  'Excellent college with great facilities and faculty!'
),
(
  (SELECT id FROM public.colleges LIMIT 1),
  '9031de15-ece0-4acc-ab29-754db2352b82',
  4,
  'Good infrastructure and placement opportunities.'
);
*/

-- 9. Verify the table structure
SELECT 'Reviews table structure:' as info;
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'reviews'
ORDER BY ordinal_position;

-- 10. Test the table
SELECT 'Testing reviews table:' as info;
SELECT COUNT(*) as reviews_count FROM public.reviews;

-- 11. Show sample data if any exists
SELECT 'Sample reviews data:' as info;
SELECT 
  r.id,
  r.rating,
  r.review_text,
  r.created_at,
  c.name as college_name,
  up.full_name as user_name
FROM public.reviews r
LEFT JOIN public.colleges c ON r.college_id = c.id
LEFT JOIN public.user_profiles up ON r.user_id = up.user_id
LIMIT 5; 
-- Fix Flagged Reviews Table Structure
-- This ensures the flagged_reviews table has proper foreign key relationships

-- 1. Check if flagged_reviews table exists
SELECT 'Checking flagged_reviews table:' as info;
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'flagged_reviews'
) as table_exists;

-- 2. Drop the table if it exists and recreate it properly
DROP TABLE IF EXISTS public.flagged_reviews CASCADE;

-- 3. Create flagged_reviews table with proper foreign keys
CREATE TABLE public.flagged_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid NOT NULL,
  flagged_by uuid NOT NULL,
  reason text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  admin_notes text,
  resolved_by uuid,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT fk_flagged_reviews_review
    FOREIGN KEY (review_id)
    REFERENCES public.reviews(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_flagged_reviews_flagged_by
    FOREIGN KEY (flagged_by)
    REFERENCES auth.users(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_flagged_reviews_resolved_by
    FOREIGN KEY (resolved_by)
    REFERENCES auth.users(id)
    ON DELETE SET NULL
);

-- 4. Enable RLS on flagged_reviews
ALTER TABLE public.flagged_reviews ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for flagged_reviews
CREATE POLICY "Admins can read flagged reviews"
  ON public.flagged_reviews
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles ar 
      WHERE ar.user_id = auth.uid() AND ar.is_active = true
    )
  );

CREATE POLICY "Users can flag reviews"
  ON public.flagged_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (flagged_by = auth.uid());

CREATE POLICY "Admins can manage flagged reviews"
  ON public.flagged_reviews
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles ar 
      WHERE ar.user_id = auth.uid() AND ar.is_active = true
    )
  );

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_flagged_reviews_status ON public.flagged_reviews(status);
CREATE INDEX IF NOT EXISTS idx_flagged_reviews_review_id ON public.flagged_reviews(review_id);
CREATE INDEX IF NOT EXISTS idx_flagged_reviews_flagged_by ON public.flagged_reviews(flagged_by);
CREATE INDEX IF NOT EXISTS idx_flagged_reviews_created_at ON public.flagged_reviews(created_at);

-- 7. Insert some sample flagged reviews (optional)
-- Uncomment the lines below if you want sample data:
/*
INSERT INTO public.flagged_reviews (review_id, flagged_by, reason, status) VALUES
(
  (SELECT id FROM public.reviews LIMIT 1),
  '9031de15-ece0-4acc-ab29-754db2352b82',
  'Inappropriate content',
  'pending'
);
*/

-- 8. Verify the table structure
SELECT 'Flagged reviews table structure:' as info;
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'flagged_reviews'
ORDER BY ordinal_position;

-- 9. Test the table
SELECT 'Testing flagged reviews table:' as info;
SELECT COUNT(*) as flagged_reviews_count FROM public.flagged_reviews; 
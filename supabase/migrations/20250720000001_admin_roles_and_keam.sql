/*
  # Admin Roles and KEAM Prediction System

  This migration creates:
  1. Admin roles and permissions system
  2. KEAM rank data tables
  3. KEAM prediction system
  4. File upload system for admin content
  5. Review moderation system

  ## Tables Created:
  - admin_roles (admin user roles and permissions)
  - keam_rank_data (historical KEAM rank data)
  - keam_predictions (user predictions)
  - file_uploads (admin file uploads)
  - flagged_reviews (review moderation)
*/

-- Create admin roles table
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  permissions jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT fk_admin_roles_user
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE,
    
  CONSTRAINT unique_admin_user
    UNIQUE (user_id)
);

-- Create KEAM rank data table
CREATE TABLE IF NOT EXISTS public.keam_rank_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL,
  college_code text NOT NULL,
  college_name text NOT NULL,
  course_name text NOT NULL,
  category text NOT NULL,
  rank_cutoff integer NOT NULL,
  total_seats integer,
  filled_seats integer,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT fk_keam_rank_data_college
    FOREIGN KEY (college_code)
    REFERENCES public.colleges(college_code)
    ON DELETE CASCADE
);

-- Create KEAM predictions table
CREATE TABLE IF NOT EXISTS public.keam_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  keam_rank integer NOT NULL,
  category text NOT NULL,
  prediction_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT fk_keam_predictions_user
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE SET NULL
);

-- Create file uploads table for admin content
CREATE TABLE IF NOT EXISTS public.file_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  file_url text NOT NULL,
  upload_type text NOT NULL CHECK (upload_type IN ('college_data', 'event_data', 'keam_data', 'other')),
  status text DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processed', 'failed')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT fk_file_uploads_admin
    FOREIGN KEY (admin_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Create flagged reviews table
CREATE TABLE IF NOT EXISTS public.flagged_reviews (
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
    
  CONSTRAINT fk_flagged_reviews_user
    FOREIGN KEY (flagged_by)
    REFERENCES auth.users(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_flagged_reviews_resolver
    FOREIGN KEY (resolved_by)
    REFERENCES auth.users(id)
    ON DELETE SET NULL
);

-- Enable RLS on all tables
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keam_rank_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keam_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flagged_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_roles
CREATE POLICY "Admins can read admin roles"
  ON public.admin_roles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles ar 
      WHERE ar.user_id = auth.uid() AND ar.is_active = true
    )
  );

CREATE POLICY "Super admins can manage admin roles"
  ON public.admin_roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles ar 
      WHERE ar.user_id = auth.uid() AND ar.role = 'super_admin' AND ar.is_active = true
    )
  );

-- Create policies for keam_rank_data
CREATE POLICY "Anyone can read KEAM rank data"
  ON public.keam_rank_data
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage KEAM rank data"
  ON public.keam_rank_data
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles ar 
      WHERE ar.user_id = auth.uid() AND ar.is_active = true
    )
  );

-- Create policies for keam_predictions
CREATE POLICY "Users can read own predictions"
  ON public.keam_predictions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can create predictions"
  ON public.keam_predictions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Create policies for file_uploads
CREATE POLICY "Admins can manage file uploads"
  ON public.file_uploads
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles ar 
      WHERE ar.user_id = auth.uid() AND ar.is_active = true
    )
  );

-- Create policies for flagged_reviews
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_roles_user_id ON public.admin_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_roles_active ON public.admin_roles(is_active);
CREATE INDEX IF NOT EXISTS idx_keam_rank_data_year ON public.keam_rank_data(year);
CREATE INDEX IF NOT EXISTS idx_keam_rank_data_college ON public.keam_rank_data(college_code);
CREATE INDEX IF NOT EXISTS idx_keam_rank_data_category ON public.keam_rank_data(category);
CREATE INDEX IF NOT EXISTS idx_keam_predictions_user_id ON public.keam_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_keam_predictions_category ON public.keam_predictions(category);
CREATE INDEX IF NOT EXISTS idx_file_uploads_admin_id ON public.file_uploads(admin_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_type ON public.file_uploads(upload_type);
CREATE INDEX IF NOT EXISTS idx_flagged_reviews_status ON public.flagged_reviews(status);
CREATE INDEX IF NOT EXISTS idx_flagged_reviews_review_id ON public.flagged_reviews(review_id);

-- Create trigger for updating updated_at on admin_roles
CREATE TRIGGER update_admin_roles_updated_at
    BEFORE UPDATE ON public.admin_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample admin user (replace with actual admin user ID)
-- INSERT INTO public.admin_roles (user_id, role, permissions) VALUES 
-- ('your-admin-user-id-here', 'super_admin', '["manage_colleges", "manage_events", "manage_keam_data", "manage_users", "manage_reviews"]'::jsonb);

-- Insert sample KEAM rank data (2020-2023)
INSERT INTO public.keam_rank_data (year, college_code, college_name, course_name, category, rank_cutoff, total_seats, filled_seats) VALUES
-- 2020 Data
(2020, 'CET', 'College of Engineering Trivandrum', 'Computer Science Engineering', 'General', 150, 60, 60),
(2020, 'CET', 'College of Engineering Trivandrum', 'Computer Science Engineering', 'OBC', 450, 15, 15),
(2020, 'CET', 'College of Engineering Trivandrum', 'Computer Science Engineering', 'SC', 1200, 9, 9),
(2020, 'CET', 'College of Engineering Trivandrum', 'Computer Science Engineering', 'ST', 2500, 6, 6),
(2020, 'CET', 'College of Engineering Trivandrum', 'Electronics & Communication', 'General', 300, 60, 60),
(2020, 'CET', 'College of Engineering Trivandrum', 'Electronics & Communication', 'OBC', 800, 15, 15),
(2020, 'CET', 'College of Engineering Trivandrum', 'Electronics & Communication', 'SC', 1800, 9, 9),
(2020, 'CET', 'College of Engineering Trivandrum', 'Electronics & Communication', 'ST', 3500, 6, 6),

(2020, 'NITC', 'National Institute of Technology Calicut', 'Computer Science Engineering', 'General', 50, 120, 120),
(2020, 'NITC', 'National Institute of Technology Calicut', 'Computer Science Engineering', 'OBC', 200, 30, 30),
(2020, 'NITC', 'National Institute of Technology Calicut', 'Computer Science Engineering', 'SC', 800, 18, 18),
(2020, 'NITC', 'National Institute of Technology Calicut', 'Computer Science Engineering', 'ST', 1500, 12, 12),
(2020, 'NITC', 'National Institute of Technology Calicut', 'Electronics & Communication', 'General', 100, 120, 120),
(2020, 'NITC', 'National Institute of Technology Calicut', 'Electronics & Communication', 'OBC', 400, 30, 30),
(2020, 'NITC', 'National Institute of Technology Calicut', 'Electronics & Communication', 'SC', 1200, 18, 18),
(2020, 'NITC', 'National Institute of Technology Calicut', 'Electronics & Communication', 'ST', 2000, 12, 12),

-- 2021 Data
(2021, 'CET', 'College of Engineering Trivandrum', 'Computer Science Engineering', 'General', 180, 60, 60),
(2021, 'CET', 'College of Engineering Trivandrum', 'Computer Science Engineering', 'OBC', 520, 15, 15),
(2021, 'CET', 'College of Engineering Trivandrum', 'Computer Science Engineering', 'SC', 1350, 9, 9),
(2021, 'CET', 'College of Engineering Trivandrum', 'Computer Science Engineering', 'ST', 2800, 6, 6),
(2021, 'CET', 'College of Engineering Trivandrum', 'Electronics & Communication', 'General', 350, 60, 60),
(2021, 'CET', 'College of Engineering Trivandrum', 'Electronics & Communication', 'OBC', 850, 15, 15),
(2021, 'CET', 'College of Engineering Trivandrum', 'Electronics & Communication', 'SC', 1900, 9, 9),
(2021, 'CET', 'College of Engineering Trivandrum', 'Electronics & Communication', 'ST', 3800, 6, 6),

(2021, 'NITC', 'National Institute of Technology Calicut', 'Computer Science Engineering', 'General', 60, 120, 120),
(2021, 'NITC', 'National Institute of Technology Calicut', 'Computer Science Engineering', 'OBC', 220, 30, 30),
(2021, 'NITC', 'National Institute of Technology Calicut', 'Computer Science Engineering', 'SC', 850, 18, 18),
(2021, 'NITC', 'National Institute of Technology Calicut', 'Computer Science Engineering', 'ST', 1600, 12, 12),
(2021, 'NITC', 'National Institute of Technology Calicut', 'Electronics & Communication', 'General', 120, 120, 120),
(2021, 'NITC', 'National Institute of Technology Calicut', 'Electronics & Communication', 'OBC', 420, 30, 30),
(2021, 'NITC', 'National Institute of Technology Calicut', 'Electronics & Communication', 'SC', 1250, 18, 18),
(2021, 'NITC', 'National Institute of Technology Calicut', 'Electronics & Communication', 'ST', 2100, 12, 12),

-- 2022 Data
(2022, 'CET', 'College of Engineering Trivandrum', 'Computer Science Engineering', 'General', 200, 60, 60),
(2022, 'CET', 'College of Engineering Trivandrum', 'Computer Science Engineering', 'OBC', 580, 15, 15),
(2022, 'CET', 'College of Engineering Trivandrum', 'Computer Science Engineering', 'SC', 1500, 9, 9),
(2022, 'CET', 'College of Engineering Trivandrum', 'Computer Science Engineering', 'ST', 3000, 6, 6),
(2022, 'CET', 'College of Engineering Trivandrum', 'Electronics & Communication', 'General', 380, 60, 60),
(2022, 'CET', 'College of Engineering Trivandrum', 'Electronics & Communication', 'OBC', 900, 15, 15),
(2022, 'CET', 'College of Engineering Trivandrum', 'Electronics & Communication', 'SC', 2000, 9, 9),
(2022, 'CET', 'College of Engineering Trivandrum', 'Electronics & Communication', 'ST', 4000, 6, 6),

(2022, 'NITC', 'National Institute of Technology Calicut', 'Computer Science Engineering', 'General', 70, 120, 120),
(2022, 'NITC', 'National Institute of Technology Calicut', 'Computer Science Engineering', 'OBC', 250, 30, 30),
(2022, 'NITC', 'National Institute of Technology Calicut', 'Computer Science Engineering', 'SC', 900, 18, 18),
(2022, 'NITC', 'National Institute of Technology Calicut', 'Computer Science Engineering', 'ST', 1700, 12, 12),
(2022, 'NITC', 'National Institute of Technology Calicut', 'Electronics & Communication', 'General', 140, 120, 120),
(2022, 'NITC', 'National Institute of Technology Calicut', 'Electronics & Communication', 'OBC', 450, 30, 30),
(2022, 'NITC', 'National Institute of Technology Calicut', 'Electronics & Communication', 'SC', 1300, 18, 18),
(2022, 'NITC', 'National Institute of Technology Calicut', 'Electronics & Communication', 'ST', 2200, 12, 12),

-- 2023 Data
(2023, 'CET', 'College of Engineering Trivandrum', 'Computer Science Engineering', 'General', 220, 60, 60),
(2023, 'CET', 'College of Engineering Trivandrum', 'Computer Science Engineering', 'OBC', 620, 15, 15),
(2023, 'CET', 'College of Engineering Trivandrum', 'Computer Science Engineering', 'SC', 1600, 9, 9),
(2023, 'CET', 'College of Engineering Trivandrum', 'Computer Science Engineering', 'ST', 3200, 6, 6),
(2023, 'CET', 'College of Engineering Trivandrum', 'Electronics & Communication', 'General', 400, 60, 60),
(2023, 'CET', 'College of Engineering Trivandrum', 'Electronics & Communication', 'OBC', 950, 15, 15),
(2023, 'CET', 'College of Engineering Trivandrum', 'Electronics & Communication', 'SC', 2100, 9, 9),
(2023, 'CET', 'College of Engineering Trivandrum', 'Electronics & Communication', 'ST', 4200, 6, 6),

(2023, 'NITC', 'National Institute of Technology Calicut', 'Computer Science Engineering', 'General', 80, 120, 120),
(2023, 'NITC', 'National Institute of Technology Calicut', 'Computer Science Engineering', 'OBC', 280, 30, 30),
(2023, 'NITC', 'National Institute of Technology Calicut', 'Computer Science Engineering', 'SC', 950, 18, 18),
(2023, 'NITC', 'National Institute of Technology Calicut', 'Computer Science Engineering', 'ST', 1800, 12, 12),
(2023, 'NITC', 'National Institute of Technology Calicut', 'Electronics & Communication', 'General', 160, 120, 120),
(2023, 'NITC', 'National Institute of Technology Calicut', 'Electronics & Communication', 'OBC', 480, 30, 30),
(2023, 'NITC', 'National Institute of Technology Calicut', 'Electronics & Communication', 'SC', 1350, 18, 18),
(2023, 'NITC', 'National Institute of Technology Calicut', 'Electronics & Communication', 'ST', 2300, 12, 12);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = user_uuid AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = user_uuid AND role = 'super_admin' AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user admin permissions
CREATE OR REPLACE FUNCTION get_admin_permissions(user_uuid uuid DEFAULT auth.uid())
RETURNS jsonb AS $$
BEGIN
  RETURN (
    SELECT permissions FROM public.admin_roles 
    WHERE user_id = user_uuid AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 
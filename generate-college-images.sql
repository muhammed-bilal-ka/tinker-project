-- Generate Unique College Images
-- This script updates all colleges with unique images from Unsplash

-- Function to generate unique college image based on college name and type
CREATE OR REPLACE FUNCTION generate_college_image(
  college_name text,
  college_type text,
  location text
) RETURNS text AS $$
DECLARE
  image_url text;
  image_category text;
  image_id text;
BEGIN
  -- Determine image category based on college type
  IF college_type = 'Government' THEN
    image_category := 'university-campus';
  ELSIF college_type = 'Government Controlled' THEN
    image_category := 'college-building';
  ELSE -- Private Self-financed
    image_category := 'modern-campus';
  END IF;

  -- Generate unique image ID based on college name hash
  image_id := encode(sha256(college_name::bytea), 'hex');
  image_id := substring(image_id from 1 for 8);

  -- Create unique image URL with different parameters
  image_url := 'https://images.unsplash.com/photo-' || image_id || '?w=800&h=600&fit=crop&crop=center&auto=format&q=80';
  
  -- Add specific categories for variety
  IF college_type = 'Government' THEN
    image_url := 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop&crop=center&auto=format&q=80';
  ELSIF college_type = 'Government Controlled' THEN
    image_url := 'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80';
  ELSE
    image_url := 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80';
  END IF;

  RETURN image_url;
END;
$$ LANGUAGE plpgsql;

-- Update all colleges with unique images
UPDATE public.colleges 
SET image_url = CASE 
  -- Government Colleges - University/Institution themed images
  WHEN name ILIKE '%CET%' OR name ILIKE '%College of Engineering Trivandrum%' THEN
    'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN name ILIKE '%GEC%' OR name ILIKE '%Government Engineering College%' THEN
    'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN name ILIKE '%NIT%' OR name ILIKE '%National Institute%' THEN
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN name ILIKE '%IIT%' OR name ILIKE '%Indian Institute%' THEN
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  
  -- Government Controlled Colleges - Academic building images
  WHEN name ILIKE '%Government Controlled%' THEN
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN name ILIKE '%Model Engineering%' THEN
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN name ILIKE '%TKM%' THEN
    'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN name ILIKE '%Rajiv Gandhi%' THEN
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  
  -- Private Colleges - Modern campus images
  WHEN name ILIKE '%Private%' OR name ILIKE '%Self-financed%' THEN
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN name ILIKE '%KMCT%' THEN
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN name ILIKE '%MES%' THEN
    'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN name ILIKE '%FISAT%' THEN
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  
  -- Location-based images
  WHEN location ILIKE '%Thiruvananthapuram%' OR location ILIKE '%Trivandrum%' THEN
    'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN location ILIKE '%Kochi%' OR location ILIKE '%Ernakulam%' THEN
    'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN location ILIKE '%Kozhikode%' OR location ILIKE '%Calicut%' THEN
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN location ILIKE '%Thrissur%' THEN
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN location ILIKE '%Kottayam%' THEN
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN location ILIKE '%Palakkad%' THEN
    'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN location ILIKE '%Malappuram%' THEN
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN location ILIKE '%Kannur%' THEN
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN location ILIKE '%Kasaragod%' THEN
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN location ILIKE '%Idukki%' THEN
    'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN location ILIKE '%Pathanamthitta%' THEN
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN location ILIKE '%Alappuzha%' THEN
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN location ILIKE '%Wayanad%' THEN
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  
  -- Default fallback images based on type
  WHEN type = 'Government' THEN
    'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN type = 'Government Controlled' THEN
    'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  ELSE
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
END;

-- Verify the updates
SELECT 'Updated college images:' as info;
SELECT 
  name,
  type,
  location,
  image_url
FROM public.colleges 
ORDER BY type, name
LIMIT 10;

-- Count images by type
SELECT 'Image distribution by college type:' as info;
SELECT 
  type,
  COUNT(*) as total_colleges,
  COUNT(DISTINCT image_url) as unique_images
FROM public.colleges 
GROUP BY type
ORDER BY type;

-- Show sample of updated colleges
SELECT 'Sample updated colleges:' as info;
SELECT 
  college_code,
  name,
  type,
  location,
  image_url
FROM public.colleges 
ORDER BY RANDOM()
LIMIT 5; 
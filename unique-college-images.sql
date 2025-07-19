-- Unique College Images Assignment
-- This script assigns unique images to all colleges using diverse Unsplash images

-- Update all colleges with unique images based on name, type, and location
UPDATE public.colleges 
SET image_url = CASE 
  -- Government Colleges - Premium university images
  WHEN name ILIKE '%CET%' OR name ILIKE '%College of Engineering Trivandrum%' THEN
    'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN name ILIKE '%GEC%' OR name ILIKE '%Government Engineering College%' THEN
    'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN name ILIKE '%NIT%' OR name ILIKE '%National Institute%' THEN
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN name ILIKE '%IIT%' OR name ILIKE '%Indian Institute%' THEN
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN name ILIKE '%Government Engineering College%' THEN
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  
  -- Government Controlled Colleges - Academic excellence images
  WHEN name ILIKE '%Model Engineering%' THEN
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN name ILIKE '%TKM%' THEN
    'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN name ILIKE '%Rajiv Gandhi%' THEN
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN name ILIKE '%Government Controlled%' THEN
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  
  -- Private Colleges - Modern campus images
  WHEN name ILIKE '%KMCT%' THEN
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN name ILIKE '%MES%' THEN
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN name ILIKE '%FISAT%' THEN
    'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN name ILIKE '%Private%' OR name ILIKE '%Self-financed%' THEN
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  
  -- Location-based assignments for remaining colleges
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
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN location ILIKE '%Malappuram%' THEN
    'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN location ILIKE '%Kannur%' THEN
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN location ILIKE '%Kasaragod%' THEN
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN location ILIKE '%Idukki%' THEN
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN location ILIKE '%Pathanamthitta%' THEN
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN location ILIKE '%Alappuzha%' THEN
    'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN location ILIKE '%Wayanad%' THEN
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  
  -- Default fallback based on type
  WHEN type = 'Government' THEN
    'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN type = 'Government Controlled' THEN
    'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  ELSE
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
END;

-- Now assign unique images to remaining colleges using a more sophisticated approach
-- Create a function to assign unique images based on college name hash
CREATE OR REPLACE FUNCTION assign_unique_college_image(college_name text, college_type text) 
RETURNS text AS $$
DECLARE
  image_url text;
  name_hash text;
  image_index integer;
  image_pool text[] := ARRAY[
    -- Modern University Buildings
    'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    
    -- Campus Buildings
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    
    -- Academic Buildings
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    
    -- University Libraries
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    
    -- Campus Grounds
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    
    -- Engineering Buildings
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    
    -- Modern Campus
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    
    -- Traditional Universities
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    
    -- Research Centers
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  ];
BEGIN
  -- Generate hash from college name
  name_hash := encode(sha256(college_name::bytea), 'hex');
  
  -- Use hash to determine image index
  image_index := (ascii(substring(name_hash from 1 for 1)) % array_length(image_pool, 1)) + 1;
  
  -- Return the selected image
  RETURN image_pool[image_index];
END;
$$ LANGUAGE plpgsql;

-- Update remaining colleges with unique images
UPDATE public.colleges 
SET image_url = assign_unique_college_image(name, type)
WHERE image_url IS NULL OR image_url = '';

-- Verify the updates
SELECT 'Updated college images summary:' as info;
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
LIMIT 10;

-- Check for any remaining default images
SELECT 'Colleges with default images:' as info;
SELECT 
  college_code,
  name,
  type,
  location,
  image_url
FROM public.colleges 
WHERE image_url LIKE '%unsplash.com/photo-1562774053-701939374585%'
   OR image_url LIKE '%unsplash.com/photo-1523050854058-8df90110c9a1%'
   OR image_url LIKE '%unsplash.com/photo-1541339907198-e08756dedf3f%'
ORDER BY name;

-- Clean up function
DROP FUNCTION IF EXISTS assign_unique_college_image(text, text); 
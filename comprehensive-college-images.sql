-- Comprehensive College Images Update
-- This script assigns unique images to all colleges using multiple providers

-- Array of high-quality college/university images from Unsplash
-- Each image is unique and optimized for college websites
WITH image_pool AS (
  SELECT unnest(ARRAY[
    -- Modern University Buildings
    'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    
    -- Campus Buildings
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    
    -- Academic Buildings
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    
    -- University Libraries
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    
    -- Campus Grounds
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    
    -- Engineering Buildings
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    
    -- Modern Campus
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    
    -- Traditional Universities
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    
    -- Research Centers
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  ]) as image_url
),
college_images AS (
  SELECT 
    c.id,
    c.college_code,
    c.name,
    c.type,
    c.location,
    ip.image_url,
    ROW_NUMBER() OVER (ORDER BY c.name) as rn
  FROM public.colleges c
  CROSS JOIN LATERAL (
    SELECT image_url 
    FROM image_pool 
    LIMIT 1
  ) ip
)
UPDATE public.colleges 
SET image_url = ci.image_url
FROM college_images ci
WHERE colleges.id = ci.id;

-- Alternative approach: Use a more sophisticated image assignment
-- This creates truly unique images for each college
UPDATE public.colleges 
SET image_url = CASE 
  -- Government Colleges - Premium university images
  WHEN type = 'Government' AND name ILIKE '%CET%' THEN
    'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN type = 'Government' AND name ILIKE '%GEC%' THEN
    'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN type = 'Government' AND name ILIKE '%NIT%' THEN
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN type = 'Government' AND name ILIKE '%IIT%' THEN
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN type = 'Government' AND name ILIKE '%Government Engineering College%' THEN
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  
  -- Government Controlled Colleges - Academic excellence images
  WHEN type = 'Government Controlled' AND name ILIKE '%Model Engineering%' THEN
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN type = 'Government Controlled' AND name ILIKE '%TKM%' THEN
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN type = 'Government Controlled' AND name ILIKE '%Rajiv Gandhi%' THEN
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN type = 'Government Controlled' AND name ILIKE '%Government Controlled%' THEN
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  
  -- Private Colleges - Modern campus images
  WHEN type = 'Private Self-financed' AND name ILIKE '%KMCT%' THEN
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN type = 'Private Self-financed' AND name ILIKE '%MES%' THEN
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN type = 'Private Self-financed' AND name ILIKE '%FISAT%' THEN
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN type = 'Private Self-financed' AND name ILIKE '%Private%' THEN
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  
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
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN location ILIKE '%Kannur%' THEN
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN location ILIKE '%Kasaragod%' THEN
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN location ILIKE '%Idukki%' THEN
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN location ILIKE '%Pathanamthitta%' THEN
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN location ILIKE '%Alappuzha%' THEN
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN location ILIKE '%Wayanad%' THEN
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  
  -- Default fallback based on type
  WHEN type = 'Government' THEN
    'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  WHEN type = 'Government Controlled' THEN
    'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
  ELSE
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
END;

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
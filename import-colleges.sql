-- Import Colleges Data with Complete Information
-- This script adds the college data with all required fields

-- First, let's clear any existing colleges to avoid duplicates
DELETE FROM public.colleges WHERE college_code IN ('IDK', 'KNR', 'KTE', 'MAC', 'NSS');

-- Insert the colleges with complete information
INSERT INTO public.colleges (
  college_code,
  name,
  type,
  location,
  website,
  description,
  established_year,
  affiliation,
  courses_offered,
  facilities,
  rating,
  total_seats,
  fees_range,
  placement_percentage,
  contact_phone,
  contact_email,
  address,
  latitude,
  longitude,
  image_url
) VALUES
(
  'IDK',
  'Government Engineering College, Idukki',
  'Government',
  'Idukki, Kerala',
  'https://gecidukki.ac.in',
  'Government Engineering College Idukki is a premier engineering institution established by the Government of Kerala. The college offers quality technical education with state-of-the-art facilities and experienced faculty.',
  2010,
  'APJ Abdul Kalam Technological University',
  ARRAY['Computer Science Engineering', 'Electronics & Communication Engineering', 'Electrical & Electronics Engineering', 'Mechanical Engineering', 'Civil Engineering'],
  ARRAY['Modern Computer Labs', 'Electronics Lab', 'Mechanical Workshop', 'Library', 'Sports Complex', 'Hostel Facilities', 'WiFi Campus', 'Cafeteria', 'Medical Center'],
  4.2,
  300,
  '₹12,000 - ₹15,000 per year',
  92.5,
  '+91-486-2223456',
  'principal@gecidukki.ac.in',
  'Government Engineering College, Painavu, Idukki, Kerala - 685603',
  9.8500,
  76.9700,
  'https://images.unsplash.com/photo-1562774053-701939374585?w=800'
),
(
  'KNR',
  'Government College of Engineering, Kannur',
  'Government',
  'Kannur, Kerala',
  'https://gcek.ac.in',
  'Government College of Engineering Kannur is one of the premier engineering institutions in North Kerala. The college is known for its excellent academic standards and placement records.',
  1999,
  'APJ Abdul Kalam Technological University',
  ARRAY['Computer Science Engineering', 'Electronics & Communication Engineering', 'Electrical & Electronics Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Information Technology'],
  ARRAY['Advanced Computer Labs', 'Digital Electronics Lab', 'Power Systems Lab', 'CAD/CAM Center', 'Central Library', 'Sports Ground', 'Hostel Blocks', 'Internet Center', 'Canteen', 'Health Center'],
  4.4,
  360,
  '₹12,000 - ₹15,000 per year',
  94.2,
  '+91-497-2705555',
  'principal@gcek.ac.in',
  'Government College of Engineering, Thavakkara, Kannur, Kerala - 670002',
  11.8745,
  75.3704,
  'https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=800'
),
(
  'KTE',
  'Govt. Rajiv Gandhi Institute of Technology, Kottayam',
  'Government',
  'Kottayam, Kerala',
  'https://rit.ac.in',
  'Rajiv Gandhi Institute of Technology is a premier government engineering college in Kottayam. The institution is known for its research contributions and industry collaborations.',
  1991,
  'APJ Abdul Kalam Technological University',
  ARRAY['Computer Science Engineering', 'Electronics & Communication Engineering', 'Electrical & Electronics Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Applied Electronics & Instrumentation'],
  ARRAY['High-Performance Computing Lab', 'VLSI Design Lab', 'Robotics Lab', 'Research Center', 'Digital Library', 'Innovation Hub', 'Sports Complex', 'Hostel Facilities', 'WiFi Campus', 'Cafeteria'],
  4.6,
  420,
  '₹12,000 - ₹15,000 per year',
  96.8,
  '+91-481-2575800',
  'principal@rit.ac.in',
  'Rajiv Gandhi Institute of Technology, Pampady, Kottayam, Kerala - 686501',
  9.5916,
  76.5222,
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800'
),
(
  'MAC',
  'Mar Athanasius College of Engineering, Kothamangalam',
  'Government',
  'Kothamangalam, Kerala',
  'https://mace.ac.in',
  'Mar Athanasius College of Engineering is a prestigious government-aided engineering college in Kothamangalam. The college has a rich heritage and excellent academic reputation.',
  1957,
  'APJ Abdul Kalam Technological University',
  ARRAY['Computer Science Engineering', 'Electronics & Communication Engineering', 'Electrical & Electronics Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering'],
  ARRAY['Modern Computer Centers', 'Electronics Workshop', 'Mechanical Engineering Workshop', 'Chemical Engineering Lab', 'Central Library', 'Sports Ground', 'Hostel Complex', 'Internet Facility', 'Canteen', 'Medical Unit'],
  4.3,
  450,
  '₹25,000 - ₹35,000 per year',
  89.5,
  '+91-485-2822366',
  'principal@mace.ac.in',
  'Mar Athanasius College of Engineering, Kothamangalam, Ernakulam, Kerala - 686666',
  10.0631,
  76.6283,
  'https://images.unsplash.com/photo-1498243691588-bc6fdb929d34?w=800'
),
(
  'NSS',
  'N S S College of Engineering, Palakkad',
  'Government',
  'Palakkad, Kerala',
  'https://nssce.ac.in',
  'NSS College of Engineering is a renowned government-aided engineering institution in Palakkad. The college is known for its strong academic foundation and industry partnerships.',
  1960,
  'APJ Abdul Kalam Technological University',
  ARRAY['Computer Science Engineering', 'Electronics & Communication Engineering', 'Electrical & Electronics Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Industrial Engineering'],
  ARRAY['Advanced Computing Labs', 'Communication Lab', 'Power Electronics Lab', 'Manufacturing Lab', 'Technical Library', 'Sports Complex', 'Student Hostels', 'WiFi Network', 'Food Court', 'Health Center'],
  4.1,
  390,
  '₹22,000 - ₹30,000 per year',
  87.3,
  '+91-491-2575800',
  'principal@nssce.ac.in',
  'NSS College of Engineering, Akathethara, Palakkad, Kerala - 678008',
  10.7867,
  76.6548,
  'https://images.unsplash.com/photo-1562774053-701939374585?w=800'
);

-- Verify the insertion
SELECT 
  'Colleges imported successfully' as status,
  COUNT(*) as total_colleges
FROM public.colleges 
WHERE college_code IN ('IDK', 'KNR', 'KTE', 'MAC', 'NSS');

-- Display the imported colleges
SELECT 
  college_code,
  name,
  type,
  location,
  rating,
  total_seats,
  placement_percentage
FROM public.colleges 
WHERE college_code IN ('IDK', 'KNR', 'KTE', 'MAC', 'NSS')
ORDER BY college_code; 
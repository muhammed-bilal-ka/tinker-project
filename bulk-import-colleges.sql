-- Bulk Import All Kerala Engineering Colleges
-- This script efficiently imports all colleges with realistic data

-- Clear existing colleges
DELETE FROM public.colleges;

-- Function to generate realistic college data
CREATE OR REPLACE FUNCTION generate_college_data(
  code text,
  name text,
  type text,
  location text
) RETURNS json AS $$
DECLARE
  result json;
  base_rating numeric;
  base_seats integer;
  base_fees text;
  base_placement numeric;
  year_established integer;
BEGIN
  -- Set base values based on college type
  IF type = 'Government' THEN
    base_rating := 4.0 + random() * 0.6;
    base_seats := 300 + (random() * 150)::integer;
    base_fees := '₹12,000 - ₹15,000 per year';
    base_placement := 85.0 + random() * 15.0;
    year_established := 1990 + (random() * 30)::integer;
  ELSIF type = 'Government Controlled' THEN
    base_rating := 3.8 + random() * 0.7;
    base_seats := 300 + (random() * 200)::integer;
    base_fees := '₹20,000 - ₹35,000 per year';
    base_placement := 80.0 + random() * 15.0;
    year_established := 1960 + (random() * 40)::integer;
  ELSE -- Private Self-financed
    base_rating := 3.5 + random() * 0.8;
    base_seats := 300 + (random() * 300)::integer;
    base_fees := '₹50,000 - ₹1,50,000 per year';
    base_placement := 75.0 + random() * 20.0;
    year_established := 1995 + (random() * 25)::integer;
  END IF;

  result := json_build_object(
    'college_code', code,
    'name', name,
    'type', type,
    'location', location || ', Kerala',
    'website', 'https://' || lower(replace(name, ' ', '')) || '.ac.in',
    'description', name || ' is a ' || type || ' engineering institution providing quality technical education with modern facilities and experienced faculty.',
    'established_year', year_established,
    'affiliation', 'APJ Abdul Kalam Technological University',
    'courses_offered', json_build_array('Computer Science Engineering', 'Electronics & Communication Engineering', 'Electrical & Electronics Engineering', 'Mechanical Engineering', 'Civil Engineering'),
    'facilities', json_build_array('Computer Labs', 'Electronics Workshop', 'Mechanical Lab', 'Library', 'Sports Complex', 'Hostel', 'WiFi Campus', 'Cafeteria', 'Medical Center'),
    'rating', round(base_rating::numeric, 1),
    'total_seats', base_seats,
    'fees_range', base_fees,
    'placement_percentage', round(base_placement::numeric, 1),
    'contact_phone', '+91-' || (470 + (random() * 30)::integer)::text || '-' || (2000000 + (random() * 8000000)::integer)::text,
    'contact_email', 'principal@' || lower(replace(name, ' ', '')) || '.ac.in',
    'address', name || ', ' || location || ', Kerala',
    'latitude', 8.0 + random() * 4.0,
    'longitude', 76.0 + random() * 1.0,
    'image_url', CASE 
      WHEN type = 'Government' THEN
        'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
      WHEN type = 'Government Controlled' THEN
        'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
      ELSE
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&auto=format&q=80'
    END
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Insert all colleges using the function
INSERT INTO public.colleges (
  college_code, name, type, location, website, description, established_year, affiliation,
  courses_offered, facilities, rating, total_seats, fees_range, placement_percentage,
  contact_phone, contact_email, address, latitude, longitude, image_url
)
SELECT 
  (data->>'college_code')::text,
  (data->>'name')::text,
  (data->>'type')::text,
  (data->>'location')::text,
  (data->>'website')::text,
  (data->>'description')::text,
  (data->>'established_year')::integer,
  (data->>'affiliation')::text,
  (data->'courses_offered')::jsonb,
  (data->'facilities')::jsonb,
  (data->>'rating')::numeric,
  (data->>'total_seats')::integer,
  (data->>'fees_range')::text,
  (data->>'placement_percentage')::numeric,
  (data->>'contact_phone')::text,
  (data->>'contact_email')::text,
  (data->>'address')::text,
  (data->>'latitude')::numeric,
  (data->>'longitude')::numeric,
  (data->>'image_url')::text
FROM (
  VALUES
    ('IDK', 'Government Engineering College, Idukki', 'Government', 'Idukki'),
    ('KNR', 'Government College of Engineering, Kannur', 'Government', 'Kannur'),
    ('KTE', 'Govt. Rajiv Gandhi Institute of Technology, Kottayam', 'Government', 'Kottayam'),
    ('MAC', 'Mar Athanasius College of Engineering, Kothamangalam', 'Government', 'Kothamangalam'),
    ('NSS', 'N S S College of Engineering, Palakkad', 'Government', 'Palakkad'),
    ('PKD', 'Government Engineering College, Palakkad', 'Government', 'Palakkad'),
    ('TCR', 'Govt. Engineering College, Thrissur', 'Government', 'Thrissur'),
    ('TKM', 'T K M College of Engineering, Kollam', 'Government', 'Kollam'),
    ('TVE', 'College of Engineering, Thiruvananthapuram', 'Government', 'Thiruvananthapuram'),
    ('WYD', 'Government Engineering College, Wayanad', 'Government', 'Wayanad'),
    ('ADR', 'College of Engineering, Adoor', 'Government Controlled', 'Adoor'),
    ('AEC', 'College of Engineering of Aranmula, Pathanamthitta', 'Government Controlled', 'Pathanamthitta'),
    ('CEA', 'College of Engineering, Attingal', 'Government Controlled', 'Attingal'),
    ('CEC', 'College of Engineering, Cherthala', 'Government Controlled', 'Cherthala'),
    ('CEK', 'College of Engineering, Kottarakkara, Kollam', 'Government Controlled', 'Kottarakkara'),
    ('CEM', 'College of Engineering Mutathara, Thiruvananthapuram', 'Government Controlled', 'Thiruvananthapuram'),
    ('CHN', 'College of Engineering, Chengannoor', 'Government Controlled', 'Chengannoor'),
    ('KGR', 'College of Engineering Kidangoor, Kottayam', 'Government Controlled', 'Kidangoor'),
    ('KNP', 'College of Engineering, Karunagappally, Kollam', 'Government Controlled', 'Karunagappally'),
    ('KSD', 'LBS College of Engineering, Kasaragod', 'Government Controlled', 'Kasaragod'),
    ('LBT', 'LBS Institute of Technology for Women, Thiruvananthapuram', 'Government Controlled', 'Thiruvananthapuram'),
    ('MDL', 'Model Engineering College, Ernakulam', 'Government Controlled', 'Ernakulam'),
    ('MNR', 'College of Engineering, Munnar', 'Government Controlled', 'Munnar'),
    ('PEC', 'College of Engineering Pathanapuram, Kollam', 'Government Controlled', 'Pathanapuram'),
    ('PJR', 'College of Engineering Poonjar, Kottayam', 'Government Controlled', 'Poonjar'),
    ('PRN', 'College of Engineering Perumon, Kollam', 'Government Controlled', 'Perumon'),
    ('PRP', 'College of Engineering and Management Punnapra', 'Government Controlled', 'Punnapra'),
    ('PTA', 'College of Engineering, Kallooppara, Thiruvalla', 'Government Controlled', 'Kallooppara'),
    ('SCT', 'S C T College of Engineering, Thiruvananthapuram', 'Government Controlled', 'Thiruvananthapuram'),
    ('TKR', 'College of Engineering, Trikaripur', 'Government Controlled', 'Trikaripur'),
    ('TLY', 'College of Engineering, Thalassery, Kannur', 'Government Controlled', 'Thalassery'),
    ('UCC', 'Institute of Engineering and Technology, Malappuram', 'Government Controlled', 'Malappuram'),
    ('UCE', 'University College of Engineering, Thodupuzha', 'Government Controlled', 'Thodupuzha'),
    ('UCK', 'University College of Engineering, Karlavattom, Thiruvananthapuram', 'Government Controlled', 'Karlavattom'),
    ('VDA', 'College of Engineering, Vadakara', 'Government Controlled', 'Vadakara'),
    ('AAE', 'Al-Azhar College of Engineering and Technology, Idukki', 'Private Self-financed', 'Idukki'),
    ('AAP', 'Al-Ameen Engineering College, Palakkad', 'Private Self-financed', 'Palakkad'),
    ('AIK', 'Albertian Institute of Science and Technology, Kochi', 'Private Self-financed', 'Kochi'),
    ('AJC', 'Amal Jyothi College of Engineering, Kottayam', 'Private Self-financed', 'Kottayam'),
    ('AME', 'Rajadhani Institute of Science and Technology, Palakkad', 'Private Self-financed', 'Palakkad'),
    ('ASI', 'Adi Shankara Institute of Engineering and Technology, Ernakulam', 'Private Self-financed', 'Ernakulam'),
    ('ATP', 'Ahalia School of Engineering and Technology, Palakkad', 'Private Self-financed', 'Palakkad'),
    ('AWH', 'AWH Engineering College, Kozhikode', 'Private Self-financed', 'Kozhikode'),
    ('BJK', 'Bishop Jerome Institute, Kollam', 'Private Self-financed', 'Kollam'),
    ('BMC', 'Baselios Mathews II College of Engineering, Kollam', 'Private Self-financed', 'Kollam'),
    ('CCE', 'Christ College of Engineering, Thrissur', 'Private Self-financed', 'Thrissur'),
    ('CCV', 'MGM College of Engineering and Pharmaceutical Sciences, Valanchery', 'Private Self-financed', 'Valanchery'),
    ('CIM', 'Mentor Academy for Design Entrepreneurship Innovation and Technology, Ettappilly, Ernakulam', 'Private Self-financed', 'Ettappilly'),
    ('CKC', 'Christ Knowledge City, Ernakulam', 'Private Self-financed', 'Ernakulam'),
    ('CMA', 'Carmel College of Engineering and Technology, Alappuzha', 'Private Self-financed', 'Alappuzha'),
    ('DMC', 'M. Dasan Institute of Technology, Kozhikode', 'Private Self-financed', 'Kozhikode'),
    ('ECE', 'ICCS College of Engineering and Management, Thrissur', 'Private Self-financed', 'Thrissur'),
    ('EKC', 'Eranad Knowledge City Technical Campus, Malappuram', 'Private Self-financed', 'Malappuram'),
    ('FIT', 'Federal Institute of Science and Technology, Ernakulam', 'Private Self-financed', 'Ernakulam'),
    ('GIK', 'Gregorian Institute of Technology, Kanjirampara, Kottayam', 'Private Self-financed', 'Kanjirampara'),
    ('HCE', 'Heera College of Engineering and Technology, Thiruvananthapuram', 'Private Self-financed', 'Thiruvananthapuram'),
    ('HGW', 'Holy Grace Academy of Engineering, Thrissur', 'Private Self-financed', 'Thrissur'),
    ('ICE', 'Ilahia College of Engineering and Technology, Ernakulam', 'Private Self-financed', 'Ernakulam'),
    ('IES', 'I E S College of Engineering, Thrissur', 'Private Self-financed', 'Thrissur'),
    ('IGW', 'Indira Gandhi Institute of Engineering and Technology, Ernakulam', 'Private Self-financed', 'Ernakulam'),
    ('JBT', 'Jai Bharath College of Management and Engineering Technology, Ernakulam', 'Private Self-financed', 'Ernakulam'),
    ('JCE', 'Jawaharlal College of Engineering and Technology, Palakkad', 'Private Self-financed', 'Palakkad'),
    ('JEC', 'Jyothi Engineering College, Thrissur', 'Private Self-financed', 'Thrissur'),
    ('JIT', 'John Cox Memorial C S I Institute of Technology, Thiruvananthapuram', 'Private Self-financed', 'Thiruvananthapuram'),
    ('KIT', 'Kottayam Institute of Technology and Science, Kottayam', 'Private Self-financed', 'Kottayam'),
    ('KMC', 'KMCT College of Engineering, Kozhikode', 'Private Self-financed', 'Kozhikode'),
    ('KME', 'K M E A Engineering College, Cochin', 'Private Self-financed', 'Cochin'),
    ('KMI', 'KMCT Institute of Technology and Management, Kuttippuram, Malappuram', 'Private Self-financed', 'Kuttippuram'),
    ('KMT', 'KMCT Institute of Emerging Technology and Management, Mukkam, Kozhikode', 'Private Self-financed', 'Mukkam'),
    ('KMW', 'KMCT College of Engineering for Women, Kozhikode', 'Private Self-financed', 'Kozhikode'),
    ('KVE', 'KVM College of Engineering and Information Technology, Alappuzha', 'Private Self-financed', 'Alappuzha'),
    ('LMC', 'Lourdes Matha College of Science and Technology, Thiruvananthapuram', 'Private Self-financed', 'Thiruvananthapuram'),
    ('MBC', 'Mar Baselios Christian College of Engineering and Technology, Idukki', 'Private Self-financed', 'Idukki'),
    ('MBI', 'Mar Baselios Institute of Technology and Science, Ernakulam', 'Private Self-financed', 'Ernakulam'),
    ('MBT', 'Mar Baselios College of Engineering and Technology, Thiruvananthapuram', 'Private Self-financed', 'Thiruvananthapuram'),
    ('MCC', 'Musaliar College of Engineering, Thiruvananthapuram', 'Private Self-financed', 'Thiruvananthapuram'),
    ('MCE', 'Marian Engineering College, Thiruvananthapuram', 'Private Self-financed', 'Thiruvananthapuram'),
    ('MCK', 'Musaliar College of Engineering and Technology, Pathanamthitta', 'Private Self-financed', 'Pathanamthitta'),
    ('MCT', 'Mohandas College of Engineering and Technology, Thiruvananthapuram', 'Private Self-financed', 'Thiruvananthapuram'),
    ('MEA', 'M E A Engineering College, Vengoor', 'Private Self-financed', 'Vengoor'),
    ('MEC', 'Malabar College of Engineering and Technology, Thrissur', 'Private Self-financed', 'Thrissur'),
    ('MEE', 'MES College of Engineering and Technology, Ernakulam', 'Private Self-financed', 'Ernakulam'),
    ('MEK', 'MES Institute of Technology and Management, Kollam', 'Private Self-financed', 'Kollam'),
    ('MES', 'M E S College of Engineering, Kuttippuram', 'Private Self-financed', 'Kuttippuram'),
    ('MET', 'Mets School of Engineering, Thrissur', 'Private Self-financed', 'Thrissur'),
    ('MGC', 'M G College of Engineering, Thiruvananthapuram', 'Private Self-financed', 'Thiruvananthapuram'),
    ('MGE', 'MGM College of Engineering & Technology, Ernakulam', 'Private Self-financed', 'Ernakulam'),
    ('MGP', 'Saintgits College of Engineering, Kottayam', 'Private Self-financed', 'Kottayam'),
    ('MHP', 'ACE College of Engineering, Thiruvananthapuram', 'Private Self-financed', 'Thiruvananthapuram'),
    ('MLM', 'Mangalam College of Engineering, Kottayam', 'Private Self-financed', 'Kottayam'),
    ('MLT', 'Malabar Institute of Technology, Kannur', 'Private Self-financed', 'Kannur'),
    ('MUS', 'Muslim Association College of Engineering, Thiruvananthapuram', 'Private Self-financed', 'Thiruvananthapuram'),
    ('MUT', 'Muthoot Institute of Technology and Science, Ernakulam', 'Private Self-financed', 'Ernakulam'),
    ('MZC', 'Mount Zion College of Engineering, Pathanamthitta', 'Private Self-financed', 'Pathanamthitta'),
    ('NCE', 'Nehru College of Engineering and Research Centre, Thrissur', 'Private Self-financed', 'Thrissur'),
    ('NIE', 'Nirmala College of Engineering Technology and Management, Thrissur', 'Private Self-financed', 'Thrissur'),
    ('PRC', 'Providence College of Engineering, Chengannur', 'Private Self-financed', 'Chengannur'),
    ('RCE', 'Royal College of Engineering and Technology, Thrissur', 'Private Self-financed', 'Thrissur'),
    ('RET', 'Rajagiri School of Engineering and Technology, Ernakulam', 'Private Self-financed', 'Ernakulam'),
    ('RIE', 'Rajadhani Institute of Engineering and Technology, Thiruvananthapuram', 'Private Self-financed', 'Thiruvananthapuram'),
    ('SBC', 'Sree Buddha College of Engineering, Alappuzha', 'Private Self-financed', 'Alappuzha'),
    ('SCM', 'SCMS School of Engineering and Technology, Ernakulam', 'Private Self-financed', 'Ernakulam'),
    ('SHR', 'Sahrdaya College of Engineering and Technology, Thrissur', 'Private Self-financed', 'Thrissur'),
    ('SIT', 'Sarabhai Institute of Science and Technology, Thiruvananthapuram', 'Private Self-financed', 'Thiruvananthapuram'),
    ('SJC', 'St Joseph''s College of Engineering and Technology, Palai', 'Private Self-financed', 'Palai'),
    ('SNC', 'Sree Narayana Guru College of Engineering and Technology, Kannur', 'Private Self-financed', 'Kannur'),
    ('SNG', 'Sree Narayana Gurukulam College of Engineering, Ernakulam', 'Private Self-financed', 'Ernakulam'),
    ('SNM', 'SNM Institute of Management and Technology, Ernakulam', 'Private Self-financed', 'Ernakulam'),
    ('SNP', 'Free Narayana Institute of Technology, Adoor', 'Private Self-financed', 'Adoor'),
    ('SPT', 'Sreepathy Institute of Management and Technology, Palakkad', 'Private Self-financed', 'Palakkad'),
    ('STC', 'St Thomas College of Engineering and Technology, Alappuzha', 'Private Self-financed', 'Alappuzha'),
    ('STI', 'St. Thomas Institute for Science and Technology, Thiruvananthapuram', 'Private Self-financed', 'Thiruvananthapuram'),
    ('STM', 'St. Thomas College of Engineering and Technology, Kannur', 'Private Self-financed', 'Kannur'),
    ('TCE', 'TOMS College of Engineering, Kottayam', 'Private Self-financed', 'Kottayam'),
    ('TEC', 'Travancore Engineering College, Kollam', 'Private Self-financed', 'Kollam'),
    ('TJE', 'Thejus Engineering College, Thrissur', 'Private Self-financed', 'Thrissur'),
    ('TKI', 'T K M Institute of Technology, Kollam', 'Private Self-financed', 'Kollam'),
    ('TOC', 'Toc H Institute of Science and Technology, Ernakulam', 'Private Self-financed', 'Ernakulam'),
    ('UKP', 'UKF College of Engineering and Technology, Kollam', 'Private Self-financed', 'Kollam'),
    ('UNT', 'Universal Engineering College, Thrissur', 'Private Self-financed', 'Thrissur'),
    ('VAK', 'Vidya Academy of Science and Technology, Thiruvananthapuram', 'Private Self-financed', 'Thiruvananthapuram'),
    ('VAS', 'Vidya Academy of Science and Technology, Thrissur', 'Private Self-financed', 'Thrissur'),
    ('VIT', 'VISAT Engineering College', 'Private Self-financed', 'Ernakulam'),
    ('VJC', 'Viswajyothi College of Engineering and Technology, Ernakulam', 'Private Self-financed', 'Ernakulam'),
    ('VKE', 'Valia Koonambaikulathamma College of Engineering and Technology, Parippally', 'Private Self-financed', 'Parippally'),
    ('VML', 'Vimal Jyothi Engineering College, Kannur', 'Private Self-financed', 'Kannur'),
    ('VPE', 'Mahaguru Institute of Technology, Mavelikkara, Alappuzha', 'Private Self-financed', 'Mavelikkara'),
    ('VVT', 'Veda Vyasa Institute of Technology, Malappuram', 'Private Self-financed', 'Malappuram'),
    ('YCE', 'Younus College of Engineering and Technology, Kollam', 'Private Self-financed', 'Kollam')
) AS colleges(code, name, type, location)
CROSS JOIN LATERAL generate_college_data(code, name, type, location) AS data;

-- Clean up the function
DROP FUNCTION generate_college_data(text, text, text, text);

-- Verify the import
SELECT 
  'Import completed successfully' as status,
  COUNT(*) as total_colleges,
  COUNT(CASE WHEN type = 'Government' THEN 1 END) as government_colleges,
  COUNT(CASE WHEN type = 'Government Controlled' THEN 1 END) as government_controlled_colleges,
  COUNT(CASE WHEN type = 'Private Self-financed' THEN 1 END) as private_colleges
FROM public.colleges;

-- Show sample of imported colleges
SELECT 
  college_code,
  name,
  type,
  location,
  rating,
  total_seats,
  placement_percentage
FROM public.colleges 
ORDER BY type, college_code
LIMIT 20; 
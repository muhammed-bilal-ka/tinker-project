/*
  # Create colleges table and populate with Kerala engineering colleges data

  1. New Tables
    - `colleges`
      - `id` (uuid, primary key)
      - `college_code` (text, unique college identifier)
      - `name` (text, college name)
      - `type` (text, government/private/self-finance etc.)
      - `location` (text, district/city)
      - `website` (text, college website URL)
      - `description` (text, college description)
      - `established_year` (integer, year established)
      - `affiliation` (text, university affiliation)
      - `courses_offered` (jsonb, array of courses)
      - `facilities` (jsonb, array of facilities)
      - `rating` (decimal, college rating out of 5)
      - `total_seats` (integer, total intake capacity)
      - `fees_range` (text, fee structure)
      - `placement_percentage` (decimal, placement rate)
      - `contact_phone` (text, contact number)
      - `contact_email` (text, contact email)
      - `address` (text, full address)
      - `latitude` (decimal, for map integration)
      - `longitude` (decimal, for map integration)
      - `image_url` (text, college image)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `colleges` table
    - Add policy for public read access
    - Add policy for authenticated users to read all data
*/

-- Create colleges table
CREATE TABLE IF NOT EXISTS colleges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  college_code text UNIQUE NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  location text,
  website text,
  description text,
  established_year integer,
  affiliation text,
  courses_offered jsonb DEFAULT '[]'::jsonb,
  facilities jsonb DEFAULT '[]'::jsonb,
  rating decimal(2,1) DEFAULT 0.0,
  total_seats integer DEFAULT 0,
  fees_range text,
  placement_percentage decimal(5,2) DEFAULT 0.0,
  contact_phone text,
  contact_email text,
  address text,
  latitude decimal(10,8),
  longitude decimal(11,8),
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to colleges"
  ON colleges
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users full access to colleges"
  ON colleges
  FOR ALL
  TO authenticated
  USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_colleges_type ON colleges(type);
CREATE INDEX IF NOT EXISTS idx_colleges_location ON colleges(location);
CREATE INDEX IF NOT EXISTS idx_colleges_rating ON colleges(rating DESC);

-- Insert college data from the Excel file
INSERT INTO colleges (college_code, name, type, location, website, description, established_year, affiliation, courses_offered, facilities, rating, total_seats, fees_range, placement_percentage, contact_phone, contact_email, address, image_url) VALUES

-- Government Colleges
('CET', 'College of Engineering Trivandrum', 'Government', 'Thiruvananthapuram', 'https://cet.ac.in', 'Premier engineering college in Kerala established in 1939, known for excellence in technical education and research.', 1939, 'Kerala Technological University', 
'["Computer Science Engineering", "Electronics & Communication", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Chemical Engineering", "Architecture", "Information Technology"]'::jsonb,
'["Central Library", "Computer Labs", "Research Centers", "Hostels", "Sports Complex", "Cafeteria", "Medical Center", "Auditorium", "Wi-Fi Campus", "Placement Cell"]'::jsonb,
4.5, 480, '₹15,000/year', 85.5, '+91 471 2515565', 'principal@cet.ac.in', 'Sreekariyam, Thiruvananthapuram, Kerala 695016', 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=800'),

('NITC', 'National Institute of Technology Calicut', 'Central', 'Kozhikode', 'https://nitc.ac.in', 'Premier technical institution with national importance, known for cutting-edge research and innovation.', 1961, 'Autonomous', 
'["Computer Science Engineering", "Electronics & Communication", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Chemical Engineering", "Production Engineering", "Architecture"]'::jsonb,
'["Central Library", "Advanced Labs", "Research Centers", "Hostels", "Sports Complex", "Health Center", "Auditorium", "Wi-Fi Campus", "Innovation Center"]'::jsonb,
4.8, 900, '₹1,25,000/year', 95.2, '+91 495 2286100', 'director@nitc.ac.in', 'NIT Campus P.O, Kozhikode, Kerala 673601', 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=800'),

('CUSAT', 'Cochin University of Science and Technology', 'State', 'Kochi', 'https://cusat.ac.in', 'Leading technical university known for innovation, research and industry collaboration.', 1971, 'Autonomous', 
'["Computer Science Engineering", "Information Technology", "Electronics & Communication", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Safety & Fire Engineering"]'::jsonb,
'["University Library", "Computer Centers", "Research Labs", "Hostels", "Sports Facilities", "Medical Center", "Auditorium", "Innovation Hub"]'::jsonb,
4.3, 1200, '₹25,000/year', 78.9, '+91 484 2862327', 'registrar@cusat.ac.in', 'Cochin University P.O, Kochi, Kerala 682022', 'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=800'),

('GECTCR', 'Government Engineering College Thrissur', 'Government', 'Thrissur', 'https://gectcr.ac.in', 'Government engineering college with strong industry connections and excellent placement record.', 1957, 'Kerala Technological University', 
'["Computer Science Engineering", "Electronics & Communication", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"]'::jsonb,
'["Library", "Computer Labs", "Workshops", "Hostels", "Sports Ground", "Cafeteria", "Medical Room", "Auditorium"]'::jsonb,
4.2, 300, '₹15,000/year', 82.1, '+91 487 2370424', 'principal@gectcr.ac.in', 'Thrissur, Kerala 680009', 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&w=800'),

('RIT', 'Rajiv Gandhi Institute of Technology', 'Government', 'Kottayam', 'https://rit.ac.in', 'Modern engineering college with excellent infrastructure and placement opportunities.', 1991, 'Kerala Technological University', 
'["Computer Science Engineering", "Electronics & Communication", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"]'::jsonb,
'["Library", "Computer Labs", "Workshops", "Hostels", "Sports Complex", "Cafeteria", "Health Center"]'::jsonb,
4.1, 300, '₹15,000/year', 79.3, '+91 481 2731134', 'principal@rit.ac.in', 'Pampady, Kottayam, Kerala 686502', 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=800'),

('GECBH', 'Government Engineering College Barton Hill', 'Government', 'Thiruvananthapuram', 'https://gecbh.ac.in', 'Government engineering college known for quality education and research.', 1999, 'Kerala Technological University', 
'["Computer Science Engineering", "Electronics & Communication", "Mechanical Engineering", "Civil Engineering"]'::jsonb,
'["Library", "Computer Labs", "Workshops", "Hostels", "Sports Facilities", "Cafeteria"]'::jsonb,
4.0, 240, '₹15,000/year', 75.8, '+91 471 2418830', 'principal@gecbh.ac.in', 'Karakonam, Thiruvananthapuram, Kerala 695504', 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=800'),

('SCTCE', 'Sree Chitra Thirunal College of Engineering', 'Government', 'Thiruvananthapuram', 'https://sctce.ac.in', 'Government engineering college with focus on technical excellence and innovation.', 1995, 'Kerala Technological University', 
'["Computer Science Engineering", "Electronics & Communication", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"]'::jsonb,
'["Library", "Computer Labs", "Workshops", "Hostels", "Sports Ground", "Cafeteria"]'::jsonb,
4.0, 300, '₹15,000/year', 77.2, '+91 471 2720661', 'principal@sctce.ac.in', 'Pappanamcode, Thiruvananthapuram, Kerala 695018', 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=800'),

-- Private/Self-Finance Colleges
('TIST', 'Toc H Institute of Science and Technology', 'Private', 'Kochi', 'https://tistcochin.in', 'Private engineering college with modern facilities and strong industry partnerships.', 1998, 'Kerala Technological University', 
'["Computer Science Engineering", "Electronics & Communication", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Information Technology"]'::jsonb,
'["Library", "Computer Labs", "Workshops", "Hostels", "Sports Complex", "Cafeteria", "Medical Center"]'::jsonb,
4.0, 720, '₹85,000/year', 72.5, '+91 484 2660999', 'principal@tistcochin.in', 'Arakunnam, Kochi, Kerala 682313', 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=800'),

('MACE', 'Mar Athanasius College of Engineering', 'Private', 'Kottayam', 'https://mace.ac.in', 'Prestigious private engineering college with excellent academic standards.', 1961, 'Kerala Technological University', 
'["Computer Science Engineering", "Electronics & Communication", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"]'::jsonb,
'["Library", "Computer Labs", "Research Centers", "Hostels", "Sports Facilities", "Cafeteria"]'::jsonb,
3.9, 600, '₹75,000/year', 74.1, '+91 481 2731009', 'principal@mace.ac.in', 'Kothamangalam, Ernakulam, Kerala 686666', 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=800'),

('FISAT', 'Federal Institute of Science and Technology', 'Self-Finance', 'Kochi', 'https://fisat.ac.in', 'Self-financing engineering college with modern infrastructure and industry focus.', 2002, 'Kerala Technological University', 
'["Computer Science Engineering", "Electronics & Communication", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Information Technology"]'::jsonb,
'["Library", "Computer Labs", "Workshops", "Hostels", "Sports Complex", "Cafeteria"]'::jsonb,
3.8, 720, '₹80,000/year', 70.3, '+91 484 2862327', 'principal@fisat.ac.in', 'Hormis Nagar, Mookkannoor, Angamaly, Kerala 683577', 'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=800'),

('MBCET', 'Mar Baselios College of Engineering and Technology', 'Private', 'Thiruvananthapuram', 'https://mbcet.ac.in', 'Private engineering college known for quality education and student development.', 2001, 'Kerala Technological University', 
'["Computer Science Engineering", "Electronics & Communication", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"]'::jsonb,
'["Library", "Computer Labs", "Workshops", "Hostels", "Sports Facilities", "Cafeteria"]'::jsonb,
3.7, 600, '₹78,000/year', 68.9, '+91 471 2484404', 'principal@mbcet.ac.in', 'Peermade, Idukki, Kerala 685531', 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=800'),

('SJCET', 'St. Joseph College of Engineering and Technology', 'Private', 'Palai', 'https://sjcetpalai.ac.in', 'Private engineering college with focus on holistic education and character building.', 2002, 'Kerala Technological University', 
'["Computer Science Engineering", "Electronics & Communication", "Mechanical Engineering", "Civil Engineering"]'::jsonb,
'["Library", "Computer Labs", "Workshops", "Hostels", "Sports Ground", "Cafeteria", "Chapel"]'::jsonb,
3.6, 480, '₹76,000/year', 66.7, '+91 4822 212785', 'principal@sjcetpalai.ac.in', 'Choondacherry, Palai, Kottayam, Kerala 686579', 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=800'),

('LBSITW', 'LBS Institute of Technology for Women', 'Government', 'Thiruvananthapuram', 'https://lbsitw.ac.in', 'Government engineering college exclusively for women, promoting gender equality in technical education.', 2001, 'Kerala Technological University', 
'["Computer Science Engineering", "Electronics & Communication", "Information Technology", "Electrical Engineering"]'::jsonb,
'["Library", "Computer Labs", "Workshops", "Hostels", "Sports Facilities", "Cafeteria", "Medical Center"]'::jsonb,
4.1, 240, '₹15,000/year', 81.4, '+91 471 2598122', 'principal@lbsitw.ac.in', 'Poojappura, Thiruvananthapuram, Kerala 695012', 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=800'),

('IHRD', 'Institute of Human Resources Development', 'Government', 'Thiruvananthapuram', 'https://ihrd.ac.in', 'Government institute focusing on human resource development in technical fields.', 1987, 'Kerala Technological University', 
'["Computer Science Engineering", "Electronics & Communication", "Mechanical Engineering", "Civil Engineering"]'::jsonb,
'["Library", "Computer Labs", "Workshops", "Training Centers", "Cafeteria"]'::jsonb,
3.9, 360, '₹15,000/year', 73.6, '+91 471 2341250', 'director@ihrd.ac.in', 'Jagathy, Thiruvananthapuram, Kerala 695014', 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=800'),

('KMCT', 'KMCT College of Engineering', 'Private', 'Kozhikode', 'https://kmct.edu.in', 'Private engineering college with modern infrastructure and industry-oriented curriculum.', 2002, 'Kerala Technological University', 
'["Computer Science Engineering", "Electronics & Communication", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"]'::jsonb,
'["Library", "Computer Labs", "Workshops", "Hostels", "Sports Complex", "Cafeteria"]'::jsonb,
3.8, 600, '₹82,000/year', 71.2, '+91 495 2289999', 'principal@kmct.edu.in', 'Manassery, Mukkam, Kozhikode, Kerala 673602', 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=800');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_colleges_updated_at 
    BEFORE UPDATE ON colleges 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
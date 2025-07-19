/*
  # Create Events Tables and Relationships

  This migration creates the complete events system with:
  1. events table - Main events data
  2. event_speakers table - Event speakers with details
  3. event_agenda table - Event agenda/schedule
  4. event_sponsors table - Event sponsors
  5. event_registrations table - User event registrations
  6. Proper relationships and constraints
  7. Sample data for testing

  ## Tables Created:
  - events (main events table)
  - event_speakers (speakers for each event)
  - event_agenda (agenda items for each event)
  - event_sponsors (sponsors for each event)
  - event_registrations (user registrations for events)
*/

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  full_description text,
  date date NOT NULL,
  end_date date,
  time time,
  end_time time,
  location text NOT NULL,
  venue text NOT NULL,
  address text,
  category text NOT NULL,
  image_url text,
  attendees_limit integer,
  current_attendees integer DEFAULT 0,
  price text DEFAULT 'Free',
  organizer text NOT NULL,
  organizer_image_url text,
  registration_link text,
  website text,
  email text,
  phone text,
  featured boolean DEFAULT false,
  tags text[] DEFAULT '{}',
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create event_speakers table
CREATE TABLE IF NOT EXISTS public.event_speakers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL,
  name text NOT NULL,
  title text,
  company text,
  image_url text,
  topic text,
  bio text,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT fk_event_speakers_event
    FOREIGN KEY (event_id)
    REFERENCES public.events(id)
    ON DELETE CASCADE
);

-- Create event_agenda table
CREATE TABLE IF NOT EXISTS public.event_agenda (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL,
  time_slot text NOT NULL,
  title text NOT NULL,
  description text,
  speaker_name text,
  duration_minutes integer,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT fk_event_agenda_event
    FOREIGN KEY (event_id)
    REFERENCES public.events(id)
    ON DELETE CASCADE
);

-- Create event_sponsors table
CREATE TABLE IF NOT EXISTS public.event_sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL,
  name text NOT NULL,
  logo_url text,
  website text,
  sponsorship_level text DEFAULT 'standard',
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT fk_event_sponsors_event
    FOREIGN KEY (event_id)
    REFERENCES public.events(id)
    ON DELETE CASCADE
);

-- Create event_registrations table
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL,
  user_id uuid NOT NULL,
  registration_date timestamptz DEFAULT now(),
  status text DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  notes text,
  
  CONSTRAINT fk_event_registrations_event
    FOREIGN KEY (event_id)
    REFERENCES public.events(id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_event_registrations_user
    FOREIGN KEY (user_id)
    REFERENCES public.user_profiles(user_id)
    ON DELETE CASCADE,
    
  CONSTRAINT unique_user_event_registration
    UNIQUE (event_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_agenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for events table
CREATE POLICY "Anyone can read events"
  ON public.events
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create events"
  ON public.events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Event organizers can update events"
  ON public.events
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for event_speakers table
CREATE POLICY "Anyone can read event speakers"
  ON public.event_speakers
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage event speakers"
  ON public.event_speakers
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for event_agenda table
CREATE POLICY "Anyone can read event agenda"
  ON public.event_agenda
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage event agenda"
  ON public.event_agenda
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for event_sponsors table
CREATE POLICY "Anyone can read event sponsors"
  ON public.event_sponsors
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage event sponsors"
  ON public.event_sponsors
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for event_registrations table
CREATE POLICY "Users can read own registrations"
  ON public.event_registrations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own registrations"
  ON public.event_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own registrations"
  ON public.event_registrations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_location ON public.events(location);
CREATE INDEX IF NOT EXISTS idx_events_featured ON public.events(featured);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_event_speakers_event_id ON public.event_speakers(event_id);
CREATE INDEX IF NOT EXISTS idx_event_agenda_event_id ON public.event_agenda(event_id);
CREATE INDEX IF NOT EXISTS idx_event_agenda_order ON public.event_agenda(order_index);
CREATE INDEX IF NOT EXISTS idx_event_sponsors_event_id ON public.event_sponsors(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON public.event_registrations(user_id);

-- Create trigger for updating updated_at on events table
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample events data
INSERT INTO public.events (
  title, description, full_description, date, end_date, time, end_time, 
  location, venue, address, category, image_url, attendees_limit, 
  current_attendees, price, organizer, organizer_image_url, 
  registration_link, website, email, phone, featured, tags
) VALUES
(
  'Kerala Tech Summit 2024',
  'Annual tech summit bringing together industry leaders, startups, and tech enthusiasts.',
  'The Kerala Tech Summit 2024 is the premier technology conference in Kerala, bringing together industry leaders, innovators, startups, and tech enthusiasts from across the region. This year''s summit focuses on emerging technologies, digital transformation, and the future of tech in Kerala.',
  '2024-03-15',
  '2024-03-16',
  '09:00:00',
  '18:00:00',
  'Kochi',
  'Lulu International Convention Centre',
  'Lulu International Convention Centre, Edapally, Kochi, Kerala 682024',
  'Conference',
  'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800',
  1000,
  850,
  'Free',
  'Kerala IT Mission',
  'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=100',
  'https://example.com/register',
  'https://keralatechsummit.com',
  'info@keralatechsummit.com',
  '+91 484 1234567',
  true,
  ARRAY['Technology', 'AI', 'Blockchain', 'Startups', 'Innovation', 'Kerala']
),
(
  'CodeStorm Hackathon',
  '48-hour hackathon focused on solving real-world problems using technology.',
  'Join us for an intensive 48-hour hackathon where developers, designers, and innovators come together to solve real-world problems. This event focuses on creating innovative solutions using cutting-edge technologies.',
  '2024-03-22',
  '2024-03-24',
  '10:00:00',
  '18:00:00',
  'Thiruvananthapuram',
  'College of Engineering Trivandrum',
  'College of Engineering Trivandrum, Sreekariyam, Thiruvananthapuram, Kerala 695016',
  'Hackathon',
  'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800',
  500,
  320,
  '₹500',
  'TechHub Kerala',
  'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=100',
  'https://example.com/register',
  'https://codestormhackathon.com',
  'info@codestormhackathon.com',
  '+91 471 2345678',
  false,
  ARRAY['Hackathon', 'Programming', 'Innovation', 'Technology']
),
(
  'AI & Machine Learning Workshop',
  'Comprehensive workshop on artificial intelligence and machine learning applications.',
  'A hands-on workshop covering the fundamentals of AI and ML, including practical applications, tools, and frameworks. Perfect for developers and data scientists.',
  '2024-03-28',
  '2024-03-28',
  '14:00:00',
  '18:00:00',
  'Kozhikode',
  'NIT Calicut',
  'NIT Campus P.O, Kozhikode, Kerala 673601',
  'Workshop',
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
  200,
  180,
  '₹1000',
  'AI Kerala',
  'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=100',
  'https://example.com/register',
  'https://aikerala.org',
  'workshop@aikerala.org',
  '+91 495 3456789',
  false,
  ARRAY['AI', 'Machine Learning', 'Workshop', 'Data Science']
),
(
  'Startup Pitch Competition',
  'Platform for startups to pitch their ideas to investors and industry experts.',
  'An exciting platform where innovative startups get the opportunity to pitch their ideas to a panel of investors, industry experts, and potential partners.',
  '2024-04-05',
  '2024-04-05',
  '11:00:00',
  '17:00:00',
  'Kochi',
  'Startup Village',
  'Startup Village, Kinfra Hi-Tech Park, Kochi, Kerala 682042',
  'Competition',
  'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
  300,
  250,
  'Free',
  'Startup Kerala',
  'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=100',
  'https://example.com/register',
  'https://startupkerala.org',
  'pitch@startupkerala.org',
  '+91 484 4567890',
  true,
  ARRAY['Startup', 'Pitch', 'Investment', 'Innovation']
),
(
  'Cybersecurity Summit',
  'Learn about the latest cybersecurity threats and protection strategies.',
  'A comprehensive summit covering the latest cybersecurity threats, protection strategies, and best practices for organizations and individuals.',
  '2024-04-12',
  '2024-04-12',
  '09:30:00',
  '17:30:00',
  'Thrissur',
  'Government Engineering College',
  'Government Engineering College, Thrissur, Kerala 680009',
  'Conference',
  'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800',
  400,
  350,
  '₹750',
  'CyberSec Kerala',
  'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=100',
  'https://example.com/register',
  'https://cyberseckerala.org',
  'info@cyberseckerala.org',
  '+91 487 5678901',
  false,
  ARRAY['Cybersecurity', 'Security', 'Technology', 'Protection']
),
(
  'Women in Tech Conference',
  'Empowering women in technology through networking and skill development.',
  'A dedicated conference focused on empowering women in technology through networking, skill development, and career advancement opportunities.',
  '2024-04-20',
  '2024-04-20',
  '10:30:00',
  '16:30:00',
  'Kottayam',
  'Rajiv Gandhi Institute of Technology',
  'Rajiv Gandhi Institute of Technology, Pampady, Kottayam, Kerala 686502',
  'Conference',
  'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800',
  250,
  200,
  'Free',
  'Women Tech Kerala',
  'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=100',
  'https://example.com/register',
  'https://womentechkerala.org',
  'info@womentechkerala.org',
  '+91 481 6789012',
  false,
  ARRAY['Women in Tech', 'Diversity', 'Technology', 'Empowerment']
);

-- Insert sample speakers for Kerala Tech Summit
INSERT INTO public.event_speakers (event_id, name, title, company, image_url, topic, bio) VALUES
(
  (SELECT id FROM public.events WHERE title = 'Kerala Tech Summit 2024' LIMIT 1),
  'Dr. Rajesh Kumar',
  'Chief Technology Officer',
  'TechCorp India',
  'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200',
  'Future of AI in Healthcare',
  'Dr. Rajesh Kumar is a leading expert in AI and healthcare technology with over 15 years of experience.'
),
(
  (SELECT id FROM public.events WHERE title = 'Kerala Tech Summit 2024' LIMIT 1),
  'Priya Menon',
  'Founder & CEO',
  'StartupXYZ',
  'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200',
  'Building Scalable Startups',
  'Priya Menon is a successful entrepreneur who has built and scaled multiple technology startups.'
),
(
  (SELECT id FROM public.events WHERE title = 'Kerala Tech Summit 2024' LIMIT 1),
  'Arjun Nair',
  'Head of Innovation',
  'Global Tech Solutions',
  'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200',
  'Blockchain in Government',
  'Arjun Nair specializes in blockchain technology and its applications in government and public sector.'
);

-- Insert sample agenda for Kerala Tech Summit
INSERT INTO public.event_agenda (event_id, time_slot, title, description, speaker_name, duration_minutes, order_index) VALUES
(
  (SELECT id FROM public.events WHERE title = 'Kerala Tech Summit 2024' LIMIT 1),
  '09:00 AM - 09:30 AM',
  'Registration & Welcome Coffee',
  'Check-in and networking with fellow attendees',
  NULL,
  30,
  1
),
(
  (SELECT id FROM public.events WHERE title = 'Kerala Tech Summit 2024' LIMIT 1),
  '09:30 AM - 10:30 AM',
  'Opening Keynote',
  'Future of Technology in Kerala',
  'Dr. Rajesh Kumar',
  60,
  2
),
(
  (SELECT id FROM public.events WHERE title = 'Kerala Tech Summit 2024' LIMIT 1),
  '10:30 AM - 11:00 AM',
  'Coffee Break',
  'Networking and refreshments',
  NULL,
  30,
  3
),
(
  (SELECT id FROM public.events WHERE title = 'Kerala Tech Summit 2024' LIMIT 1),
  '11:00 AM - 12:00 PM',
  'Panel Discussion',
  'AI and Machine Learning Applications',
  'Industry Experts',
  60,
  4
),
(
  (SELECT id FROM public.events WHERE title = 'Kerala Tech Summit 2024' LIMIT 1),
  '12:00 PM - 01:00 PM',
  'Startup Showcase',
  'Kerala''s most promising startups',
  'Selected Startups',
  60,
  5
),
(
  (SELECT id FROM public.events WHERE title = 'Kerala Tech Summit 2024' LIMIT 1),
  '01:00 PM - 02:00 PM',
  'Lunch Break',
  'Networking lunch and exhibition',
  NULL,
  60,
  6
),
(
  (SELECT id FROM public.events WHERE title = 'Kerala Tech Summit 2024' LIMIT 1),
  '02:00 PM - 03:00 PM',
  'Technical Workshop',
  'Hands-on blockchain development',
  'Arjun Nair',
  60,
  7
),
(
  (SELECT id FROM public.events WHERE title = 'Kerala Tech Summit 2024' LIMIT 1),
  '03:00 PM - 04:00 PM',
  'Fireside Chat',
  'Building successful tech companies',
  'Priya Menon',
  60,
  8
),
(
  (SELECT id FROM public.events WHERE title = 'Kerala Tech Summit 2024' LIMIT 1),
  '04:00 PM - 06:00 PM',
  'Networking Session',
  'Connect with industry professionals',
  NULL,
  120,
  9
);

-- Insert sample sponsors for Kerala Tech Summit
INSERT INTO public.event_sponsors (event_id, name, logo_url, website, sponsorship_level) VALUES
(
  (SELECT id FROM public.events WHERE title = 'Kerala Tech Summit 2024' LIMIT 1),
  'TechCorp',
  'https://via.placeholder.com/120x60/2563EB/ffffff?text=TechCorp',
  'https://techcorp.com',
  'platinum'
),
(
  (SELECT id FROM public.events WHERE title = 'Kerala Tech Summit 2024' LIMIT 1),
  'InnovateLab',
  'https://via.placeholder.com/120x60/2563EB/ffffff?text=InnovateLab',
  'https://innovatelab.com',
  'gold'
),
(
  (SELECT id FROM public.events WHERE title = 'Kerala Tech Summit 2024' LIMIT 1),
  'StartupHub',
  'https://via.placeholder.com/120x60/2563EB/ffffff?text=StartupHub',
  'https://startuphub.com',
  'silver'
),
(
  (SELECT id FROM public.events WHERE title = 'Kerala Tech Summit 2024' LIMIT 1),
  'CloudTech',
  'https://via.placeholder.com/120x60/2563EB/ffffff?text=CloudTech',
  'https://cloudtech.com',
  'bronze'
);

-- Create function to update event attendees count
CREATE OR REPLACE FUNCTION update_event_attendees_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.events 
    SET current_attendees = current_attendees + 1 
    WHERE id = NEW.event_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.events 
    SET current_attendees = current_attendees - 1 
    WHERE id = OLD.event_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update attendees count
CREATE TRIGGER update_event_attendees_trigger
  AFTER INSERT OR DELETE ON public.event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_event_attendees_count(); 
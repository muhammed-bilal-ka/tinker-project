import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Clock, DollarSign, ExternalLink, Share2, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  
  // Mock data for event details
  const event = {
    id: 1,
    title: 'Kerala Tech Summit 2024',
    description: 'The Kerala Tech Summit 2024 is the premier technology conference in Kerala, bringing together industry leaders, innovators, startups, and tech enthusiasts from across the region. This year\'s summit focuses on emerging technologies, digital transformation, and the future of tech in Kerala.',
    fullDescription: 'Join us for an incredible two-day journey through the latest trends in technology, featuring keynote speeches from industry pioneers, interactive workshops, startup showcases, and networking opportunities. The summit will cover topics including artificial intelligence, blockchain, IoT, cybersecurity, and sustainable technology solutions.',
    date: '2024-03-15',
    endDate: '2024-03-16',
    time: '09:00 AM',
    endTime: '06:00 PM',
    location: 'Kochi',
    venue: 'Lulu International Convention Centre',
    address: 'Lulu International Convention Centre, Edapally, Kochi, Kerala 682024',
    category: 'Conference',
    image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800',
    attendees: '1000+',
    price: 'Free',
    organizer: 'Kerala IT Mission',
    organizerImage: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=100',
    registrationLink: 'https://example.com/register',
    website: 'https://keralatechsummit.com',
    email: 'info@keralatechsummit.com',
    phone: '+91 484 1234567',
    speakers: [
      {
        name: 'Dr. Rajesh Kumar',
        title: 'Chief Technology Officer',
        company: 'TechCorp India',
        image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200',
        topic: 'Future of AI in Healthcare'
      },
      {
        name: 'Priya Menon',
        title: 'Founder & CEO',
        company: 'StartupXYZ',
        image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200',
        topic: 'Building Scalable Startups'
      },
      {
        name: 'Arjun Nair',
        title: 'Head of Innovation',
        company: 'Global Tech Solutions',
        image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200',
        topic: 'Blockchain in Government'
      }
    ],
    agenda: [
      {
        time: '09:00 AM - 09:30 AM',
        title: 'Registration & Welcome Coffee',
        description: 'Check-in and networking with fellow attendees'
      },
      {
        time: '09:30 AM - 10:30 AM',
        title: 'Opening Keynote',
        description: 'Future of Technology in Kerala',
        speaker: 'Dr. Rajesh Kumar'
      },
      {
        time: '10:30 AM - 11:00 AM',
        title: 'Coffee Break',
        description: 'Networking and refreshments'
      },
      {
        time: '11:00 AM - 12:00 PM',
        title: 'Panel Discussion',
        description: 'AI and Machine Learning Applications',
        speaker: 'Industry Experts'
      },
      {
        time: '12:00 PM - 01:00 PM',
        title: 'Startup Showcase',
        description: 'Kerala\'s most promising startups',
        speaker: 'Selected Startups'
      },
      {
        time: '01:00 PM - 02:00 PM',
        title: 'Lunch Break',
        description: 'Networking lunch and exhibition'
      },
      {
        time: '02:00 PM - 03:00 PM',
        title: 'Technical Workshop',
        description: 'Hands-on blockchain development',
        speaker: 'Arjun Nair'
      },
      {
        time: '03:00 PM - 04:00 PM',
        title: 'Fireside Chat',
        description: 'Building successful tech companies',
        speaker: 'Priya Menon'
      },
      {
        time: '04:00 PM - 06:00 PM',
        title: 'Networking Session',
        description: 'Connect with industry professionals'
      }
    ],
    sponsors: [
      { name: 'TechCorp', logo: 'https://via.placeholder.com/120x60/2563EB/ffffff?text=TechCorp' },
      { name: 'InnovateLab', logo: 'https://via.placeholder.com/120x60/2563EB/ffffff?text=InnovateLab' },
      { name: 'StartupHub', logo: 'https://via.placeholder.com/120x60/2563EB/ffffff?text=StartupHub' },
      { name: 'CloudTech', logo: 'https://via.placeholder.com/120x60/2563EB/ffffff?text=CloudTech' }
    ],
    tags: ['Technology', 'AI', 'Blockchain', 'Startups', 'Innovation', 'Kerala']
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleRegistration = () => {
    if (!isLoggedIn) {
      // Show login prompt
      if (window.confirm('You need to be logged in to register for events. Would you like to login now?')) {
        window.location.href = '/login';
      }
      return;
    }
    
    // Redirect to external registration
    window.open(event.registrationLink, '_blank');
  };
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/events"
          className="inline-flex items-center text-[#2563EB] hover:text-[#1d4ed8] mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Events
        </Link>

        {/* Event Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="relative">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-[#2563EB] px-3 py-1 rounded-full text-sm font-medium">
                  {event.category}
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  {event.price}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{event.attendees} attendees</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">About This Event</h2>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <p className="text-gray-600">{event.fullDescription}</p>
            </div>

            {/* Speakers */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Featured Speakers</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {event.speakers.map((speaker, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{speaker.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">{speaker.title}</p>
                      <p className="text-sm text-[#2563EB] mb-2">{speaker.company}</p>
                      <p className="text-sm text-gray-700 font-medium">"{speaker.topic}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agenda */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Event Agenda</h2>
              <div className="space-y-4">
                {event.agenda.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 border-l-4 border-[#2563EB] bg-gray-50 rounded-r-lg">
                    <div className="text-sm text-[#2563EB] font-medium min-w-0 flex-shrink-0">
                      {item.time}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                      {item.speaker && (
                        <p className="text-sm text-[#2563EB] font-medium">{item.speaker}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sponsors */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Sponsors</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {event.sponsors.map((sponsor, index) => (
                  <div key={index} className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="max-w-full max-h-12 object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-[#2563EB] mb-2">{event.price}</div>
                <p className="text-gray-600">Registration</p>
              </div>
              <div className="space-y-4">
                <button
                  onClick={handleRegistration}
                  className="w-full bg-[#2563EB] text-white px-6 py-3 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200 flex items-center justify-center space-x-2 font-semibold"
                >
                  <span>Register Now</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
                <div className="flex space-x-2">
                  <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Event Details</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{formatDate(event.date)}</p>
                    <p className="text-sm text-gray-600">{event.time} - {event.endTime}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{event.venue}</p>
                    <p className="text-sm text-gray-600">{event.address}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{event.attendees} attendees</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{event.price}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Organizer */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Organizer</h3>
              <div className="flex items-start space-x-3">
                <img
                  src={event.organizerImage}
                  alt={event.organizer}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{event.organizer}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">{event.email}</p>
                    <p className="text-sm text-gray-600">{event.phone}</p>
                  </div>
                  <a
                    href={event.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#2563EB] hover:text-[#1d4ed8] text-sm mt-2 transition-colors duration-200"
                  >
                    Visit Website
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span key={index} className="bg-[#2563EB]/10 text-[#2563EB] px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
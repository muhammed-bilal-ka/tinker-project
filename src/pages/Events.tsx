import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, MapPin, Users, Clock, ExternalLink } from 'lucide-react';

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');

  // Mock data for events
  const events = [
    {
      id: 1,
      title: 'Kerala Tech Summit 2024',
      description: 'Annual tech summit bringing together industry leaders, startups, and tech enthusiasts.',
      date: '2024-03-15',
      time: '09:00 AM',
      location: 'Kochi',
      venue: 'Lulu International Convention Centre',
      category: 'Conference',
      image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400',
      attendees: '1000+',
      price: 'Free',
      organizer: 'Kerala IT Mission',
      registrationLink: 'https://example.com/register',
      featured: true
    },
    {
      id: 2,
      title: 'CodeStorm Hackathon',
      description: '48-hour hackathon focused on solving real-world problems using technology.',
      date: '2024-03-22',
      time: '10:00 AM',
      location: 'Thiruvananthapuram',
      venue: 'College of Engineering Trivandrum',
      category: 'Hackathon',
      image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400',
      attendees: '500+',
      price: '₹500',
      organizer: 'TechHub Kerala',
      registrationLink: 'https://example.com/register',
      featured: false
    },
    {
      id: 3,
      title: 'AI & Machine Learning Workshop',
      description: 'Comprehensive workshop on artificial intelligence and machine learning applications.',
      date: '2024-03-28',
      time: '02:00 PM',
      location: 'Kozhikode',
      venue: 'NIT Calicut',
      category: 'Workshop',
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
      attendees: '200+',
      price: '₹1000',
      organizer: 'AI Kerala',
      registrationLink: 'https://example.com/register',
      featured: false
    },
    {
      id: 4,
      title: 'Startup Pitch Competition',
      description: 'Platform for startups to pitch their ideas to investors and industry experts.',
      date: '2024-04-05',
      time: '11:00 AM',
      location: 'Kochi',
      venue: 'Startup Village',
      category: 'Competition',
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400',
      attendees: '300+',
      price: 'Free',
      organizer: 'Startup Kerala',
      registrationLink: 'https://example.com/register',
      featured: true
    },
    {
      id: 5,
      title: 'Cybersecurity Summit',
      description: 'Learn about the latest cybersecurity threats and protection strategies.',
      date: '2024-04-12',
      time: '09:30 AM',
      location: 'Thrissur',
      venue: 'Government Engineering College',
      category: 'Conference',
      image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=400',
      attendees: '400+',
      price: '₹750',
      organizer: 'CyberSec Kerala',
      registrationLink: 'https://example.com/register',
      featured: false
    },
    {
      id: 6,
      title: 'Women in Tech Conference',
      description: 'Empowering women in technology through networking and skill development.',
      date: '2024-04-20',
      time: '10:30 AM',
      location: 'Kottayam',
      venue: 'Rajiv Gandhi Institute of Technology',
      category: 'Conference',
      image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400',
      attendees: '250+',
      price: 'Free',
      organizer: 'Women Tech Kerala',
      registrationLink: 'https://example.com/register',
      featured: false
    }
  ];

  const categories = ['All', 'Conference', 'Hackathon', 'Workshop', 'Competition', 'Meetup'];
  const locations = ['All', 'Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kottayam'];
  const dateFilters = ['All', 'This Week', 'This Month', 'Next Month'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || event.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tech Events in Kerala
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover and participate in the latest tech events, hackathons, conferences, and workshops happening across Kerala.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events, locations, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category.toLowerCase()}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                >
                  {locations.map(location => (
                    <option key={location} value={location.toLowerCase()}>{location}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                >
                  {dateFilters.map(dateFilter => (
                    <option key={dateFilter} value={dateFilter.toLowerCase()}>{dateFilter}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredEvents.length} of {events.length} events
          </p>
        </div>

        {/* Featured Events */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Featured Events</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {filteredEvents.filter(event => event.featured).map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-[#2563EB] text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-gray-900">{event.category}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">{formatDate(event.date)} at {event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.venue}, {event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.attendees} attendees</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-semibold text-[#2563EB]">{event.price}</span>
                      <span className="text-sm text-gray-600">by {event.organizer}</span>
                    </div>
                    <Link
                      to={`/events/${event.id}`}
                      className="bg-[#2563EB] text-white px-4 py-2 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Events */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">All Events</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-gray-900">{event.category}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-[#2563EB]">{event.price}</span>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/events/${event.id}`}
                        className="bg-[#2563EB] text-white px-4 py-2 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200 text-sm"
                      >
                        View Details
                      </Link>
                      <a
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2563EB] hover:text-[#1d4ed8] transition-colors duration-200"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Show More Button */}
        {filteredEvents.length > 0 && (
          <div className="text-center">
            <button className="bg-white text-[#2563EB] border-2 border-[#2563EB] px-8 py-3 rounded-xl font-semibold hover:bg-[#2563EB] hover:text-white transition-all duration-200 shadow-lg">
              Show More Events
            </button>
          </div>
        )}

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedLocation('all');
                  setSelectedDate('all');
                }}
                className="bg-[#2563EB] text-white px-6 py-2 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
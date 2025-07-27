import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, MapPin, Users, Clock, ExternalLink } from 'lucide-react';
import { useEvents } from '../contexts/EventsContext';

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const { events, loading, error, refetch } = useEvents();

  // Get unique categories and locations from events
  const categories = ['All', ...Array.from(new Set(events.map(event => event.category)))];
  const locations = ['All', ...Array.from(new Set(events.map(event => event.location)))];
  const dateFilters = ['All', 'This Week', 'This Month', 'Next Month'];

  // Memoize filtered events
  const filteredEvents = useMemo(() => events.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || event.location === selectedLocation;
    const matchesSearch = !searchTerm ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()));
    // Date filter logic can be added as needed
    return matchesCategory && matchesLocation && matchesSearch;
  }), [events, selectedCategory, selectedLocation, searchTerm]);

  // Pagination logic
  const EVENTS_PER_PAGE = 15;
  const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(1);
  const paginatedEvents = useMemo(() => filteredEvents.slice((currentPage - 1) * EVENTS_PER_PAGE, currentPage * EVENTS_PER_PAGE), [filteredEvents, currentPage]);
  const hasMorePages = currentPage < totalPages;

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedLocation]);

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
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events, locations, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Filter className="text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent w-full sm:w-auto text-sm"
                >
                  {categories.map(category => (
                    <option key={category} value={category.toLowerCase()}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-auto">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent w-full sm:w-auto text-sm"
                >
                  {locations.map(location => (
                    <option key={location} value={location.toLowerCase()}>{location}</option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-auto">
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent w-full sm:w-auto text-sm"
                >
                  {dateFilters.map(dateFilter => (
                    <option key={dateFilter} value={dateFilter.toLowerCase()}>{dateFilter}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading events...</h3>
              <p className="text-gray-600">Please wait while we fetch the latest events.</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-xl font-semibold text-red-600 mb-2">Error loading events</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              {/* Remove any refetch or reload buttons, as context handles updates. */}
            </div>
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && (
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {paginatedEvents.length} of {filteredEvents.length} events
            </p>
          </div>
        )}

        {/* Featured Events */}
        {!loading && !error && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Featured Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.filter(event => event.featured).map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                  <div className="relative">
                    <img
                      src={event.image_url || 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={event.title}
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-[#2563EB] text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      Featured
                    </div>
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-xs sm:text-sm font-medium text-gray-900">{event.category}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-4">{event.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-xs sm:text-sm">{formatDate(event.date)}{event.time && <> at {event.time}</>}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-xs sm:text-sm">{event.venue}, {event.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span className="text-xs sm:text-sm">{event.current_attendees} attendees</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                      <div className="flex items-center space-x-2 sm:space-x-4">
                        <span className="text-base sm:text-lg font-semibold text-[#2563EB]">{event.price}</span>
                        <span className="text-xs sm:text-sm text-gray-600">by {event.organizer}</span>
                      </div>
                      <Link
                        to={`/events/${event.id}`}
                        className="bg-[#2563EB] text-white px-4 py-2 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200 text-xs sm:text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Events */}
        {!loading && !error && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">All Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                  <div className="relative">
                    <img
                      src={event.image_url || 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={event.title}
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-xs sm:text-sm font-medium text-gray-900">{event.category}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-xs sm:text-sm">{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-xs sm:text-sm">{event.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-xs sm:text-sm">{event.time}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                      <span className="text-base sm:text-lg font-semibold text-[#2563EB]">{event.price}</span>
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/events/${event.id}`}
                          className="bg-[#2563EB] text-white px-4 py-2 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200 text-xs sm:text-sm"
                        >
                          View Details
                        </Link>
                        {event.registration_link && (
                          <a
                            href={event.registration_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#2563EB] hover:text-[#1d4ed8] transition-colors duration-200 text-xs sm:text-sm"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show More Button */}
        {!loading && !error && paginatedEvents.length > 0 && hasMorePages && (
          <div className="text-center">
            <button onClick={() => setCurrentPage(prev => prev + 1)} className="bg-white text-[#2563EB] border-2 border-[#2563EB] px-8 py-3 rounded-xl font-semibold hover:bg-[#2563EB] hover:text-white transition-all duration-200 shadow-lg text-sm">
              Show More Events
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && paginatedEvents.length === 0 && (
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
                className="bg-[#2563EB] text-white px-6 py-2 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200 text-sm"
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
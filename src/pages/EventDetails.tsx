import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Clock, DollarSign, ExternalLink, Share2, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { eventService, Event, EventSpeaker, EventAgenda, EventSponsor } from '../lib/supabase';

const EventDetails = () => {
  const { id } = useParams();
  const { isLoggedIn, user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [speakers, setSpeakers] = useState<EventSpeaker[]>([]);
  const [agenda, setAgenda] = useState<EventAgenda[]>([]);
  const [sponsors, setSponsors] = useState<EventSponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch event data from database
  useEffect(() => {
    const fetchEventData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch event details
        const { data: eventData, error: eventError } = await eventService.getEventById(id);
        if (eventError) {
          setError('Failed to load event details');
          console.error('Error fetching event:', eventError);
          return;
        }
        setEvent(eventData);

        // Fetch speakers
        const { data: speakersData } = await eventService.getEventSpeakers(id);
        setSpeakers(speakersData);

        // Fetch agenda
        const { data: agendaData } = await eventService.getEventAgenda(id);
        setAgenda(agendaData);

        // Fetch sponsors
        const { data: sponsorsData } = await eventService.getEventSponsors(id);
        setSponsors(sponsorsData);

        // Check if user is registered
        if (isLoggedIn && user) {
          const { data: registrationData } = await eventService.checkUserRegistration(id, user.id);
          setIsRegistered(!!registrationData);
        }

      } catch (err) {
        setError('Failed to load event details');
        console.error('Error fetching event data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id, isLoggedIn, user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleRegistration = async () => {
    if (!isLoggedIn) {
      if (window.confirm('You need to be logged in to register for events. Would you like to login now?')) {
        window.location.href = '/login';
      }
      return;
    }

    if (!event || !user) return;

    try {
      const { error } = await eventService.registerForEvent(event.id, user.id);
      if (error) {
        alert('Failed to register for event. Please try again.');
        console.error('Registration error:', error);
      } else {
        setIsRegistered(true);
        alert('Successfully registered for the event!');
      }
    } catch (err) {
      alert('Failed to register for event. Please try again.');
      console.error('Registration error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading event details...</h3>
              <p className="text-gray-600">Please wait while we fetch the event information.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-xl font-semibold text-red-600 mb-2">Error loading event</h3>
              <p className="text-gray-600 mb-4">{error || 'Event not found'}</p>
              <Link
                to="/events"
                className="bg-[#2563EB] text-white px-6 py-2 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200"
              >
                Back to Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
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
              src={event.image_url || 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800'}
              alt={event.title}
              className="w-full h-48 sm:h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2">
                <span className="bg-[#2563EB] px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  {event.category}
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs sm:text-sm">
                  {event.price}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
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
                  <span>{event.current_attendees} attendees</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">About This Event</h2>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">{event.description}</p>
              {event.full_description && (
                <p className="text-gray-600 text-xs sm:text-base">{event.full_description}</p>
              )}
            </div>

            {/* Speakers */}
            {speakers.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Featured Speakers</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {speakers.map((speaker, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                      <img
                        src={speaker.image_url || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200'}
                        alt={speaker.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{speaker.name}</h3>
                        {speaker.title && <p className="text-sm text-gray-600">{speaker.title}</p>}
                        {speaker.company && <p className="text-sm text-gray-600">{speaker.company}</p>}
                        {speaker.topic && <p className="text-sm text-[#2563EB] font-medium">{speaker.topic}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agenda */}
            {agenda.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Event Agenda</h2>
                <div className="space-y-4">
                  {agenda.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border-l-4 border-[#2563EB] bg-gray-50 rounded-r-lg">
                      <div className="text-sm text-[#2563EB] font-medium min-w-0 flex-shrink-0">
                        {item.time_slot}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        {item.description && <p className="text-gray-600 text-sm">{item.description}</p>}
                        {item.speaker_name && <p className="text-sm text-[#2563EB] font-medium">Speaker: {item.speaker_name}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sponsors */}
            {sponsors.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Sponsors</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {sponsors.map((sponsor, index) => (
                    <div key={index} className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                      <img
                        src={sponsor.logo_url || `https://via.placeholder.com/120x60/2563EB/ffffff?text=${sponsor.name}`}
                        alt={sponsor.name}
                        className="max-w-full h-12 object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                    <p className="text-sm text-gray-600">{event.time} - {event.end_time}</p>
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
                    <p className="font-medium text-gray-900">{event.current_attendees} attendees</p>
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
                  src={event.organizer_image_url || 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=100'}
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
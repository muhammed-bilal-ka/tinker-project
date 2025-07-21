import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, eventService, type Event } from '../lib/supabase';

interface EventsContextType {
  events: Event[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) throw new Error('useEvents must be used within an EventsProvider');
  return context;
};

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await eventService.getEvents();
    if (error) {
      setError('Failed to fetch events.');
      setEvents([]);
    } else {
      setEvents(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();
    // Real-time subscription
    const channel = supabase
      .channel('events-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, payload => {
        fetchEvents();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEvents]);

  const value = { events, loading, error, refetch: fetchEvents };
  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}; 
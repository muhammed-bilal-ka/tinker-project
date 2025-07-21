import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, collegeService, type College } from '../lib/supabase';

interface CollegesContextType {
  colleges: College[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const CollegesContext = createContext<CollegesContextType | undefined>(undefined);

export const useColleges = () => {
  const context = useContext(CollegesContext);
  if (!context) throw new Error('useColleges must be used within a CollegesProvider');
  return context;
};

export const CollegesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await collegeService.getColleges();
    if (error) {
      setError('Failed to fetch colleges.');
      setColleges([]);
    } else {
      setColleges(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchColleges();
    // Real-time subscription
    const channel = supabase
      .channel('colleges-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'colleges' }, payload => {
        // Option 1: Refetch all (simple, robust)
        fetchColleges();
        // Option 2: Update state based on payload.new/payload.old (advanced, not implemented here)
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchColleges]);

  const value = { colleges, loading, error, refetch: fetchColleges };
  return <CollegesContext.Provider value={value}>{children}</CollegesContext.Provider>;
}; 
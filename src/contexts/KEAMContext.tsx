import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, keamService, type KEAMRankData } from '../lib/supabase';

interface KEAMContextType {
  keamData: KEAMRankData[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const KEAMContext = createContext<KEAMContextType | undefined>(undefined);

export const useKEAM = () => {
  const context = useContext(KEAMContext);
  if (!context) throw new Error('useKEAM must be used within a KEAMProvider');
  return context;
};

export const KEAMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [keamData, setKeamData] = useState<KEAMRankData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKEAMData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await keamService.getKEAMRankData();
    if (error) {
      setError('Failed to fetch KEAM data.');
      setKeamData([]);
    } else {
      setKeamData(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchKEAMData();
    // Real-time subscription
    const channel = supabase
      .channel('keam-rank-data-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'keam_rank_data' }, payload => {
        fetchKEAMData();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchKEAMData]);

  const value = { keamData, loading, error, refetch: fetchKEAMData };
  return <KEAMContext.Provider value={value}>{children}</KEAMContext.Provider>;
}; 
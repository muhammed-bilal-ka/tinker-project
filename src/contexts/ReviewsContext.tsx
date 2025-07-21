import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, reviewService, type Review } from '../lib/supabase';

interface ReviewsContextType {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) throw new Error('useReviews must be used within a ReviewsProvider');
  return context;
};

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    // Fetch all reviews, regardless of status
    const { data, error } = await reviewService.getReviews();
    if (error) {
      setError('Failed to fetch reviews.');
      setReviews([]);
    } else {
      setReviews(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReviews();
    // Real-time subscription
    const channel = supabase
      .channel('reviews-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, payload => {
        fetchReviews();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchReviews]);

  const value = { reviews, loading, error, refetch: fetchReviews };
  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}; 
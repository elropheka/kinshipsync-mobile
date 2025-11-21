import { useState, useEffect } from 'react';
import * as eventService from '../services/eventService';
import type { Theme } from '../types/eventTypes';
import { useAuth } from '../context/AuthContext';

export const useAllThemes = () => {
  const { isAuthenticated } = useAuth();
  const [allThemes, setAllThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const themes = await eventService.getAvailableThemes(isAuthenticated, null);
        setAllThemes(themes);
        setError(null);
      } catch (err) {
        console.error('Error fetching themes:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch themes'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchThemes();
  }, [isAuthenticated]);

  return {
    allThemes,
    isLoading,
    error
  };
};

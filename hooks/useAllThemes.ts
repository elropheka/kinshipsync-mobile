import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from '@firebase/firestore';
import { firestore } from '../services/firebaseConfig';
import type { Theme } from '../types/themeTypes';

export const useAllThemes = () => {
  const [allThemes, setAllThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const themesRef = collection(firestore, 'themes');
        const themesQuery = query(themesRef, orderBy('name'));
        const snapshot = await getDocs(themesQuery);
        
        const themes = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Theme[];

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
  }, []);

  return {
    allThemes,
    isLoading,
    error
  };
};

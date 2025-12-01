import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Theme } from '../types/eventTypes';
import { getDefaultTheme, predefinedThemes as localPredefinedThemes } from '../constants/themes';
import * as eventService from '../services/eventService';
import { useAuth } from './AuthContext';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  loadThemeForEvent: (eventId: string | null) => Promise<void>; 
  availableThemes: Theme[]; 
  refreshAvailableThemes: () => Promise<void>;
  isLoadingThemes: boolean;
}

const defaultTheme = getDefaultTheme();

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  setTheme: () => console.warn('setTheme function not yet implemented'),
  loadThemeForEvent: async () => console.warn('loadThemeForEvent not yet implemented'),
  availableThemes: localPredefinedThemes,
  refreshAvailableThemes: async () => console.warn('refreshAvailableThemes not yet implemented'),
  isLoadingThemes: false,
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [availableThemes, setAvailableThemes] = useState<Theme[]>(localPredefinedThemes);
  const [isLoadingThemes, setIsLoadingThemes] = useState(false);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const loadThemeForEvent = useCallback(async (eventId: string | null) => {
    if (!isAuthenticated) {
      setThemeState(defaultTheme);
      return;
    }
    if (!eventId) {
      setThemeState(defaultTheme);
      return;
    }
    setIsLoadingThemes(true);
    try {
      const eventSpecificTheme = await eventService.getEventTheme(isAuthenticated, eventId, user?.uid);
      if (eventSpecificTheme) {
        setThemeState(eventSpecificTheme);
      } else {
        setThemeState(defaultTheme);
      }
    } catch (error) {
      console.error(`Error loading theme for event ${eventId}:`, error);
      setThemeState(defaultTheme);
    } finally {
      setIsLoadingThemes(false);
    }
  }, [isAuthenticated, user?.uid]);

  const refreshAvailableThemes = useCallback(async () => {
    try {
      if (isLoadingThemes) {
        console.log('Theme fetch already in progress, skipping...');
        return;
      }
      
      console.log('refreshAvailableThemes called', { isAuthenticated, userId: user?.uid, isLoadingThemes });
      
      if (!isAuthenticated) {
        console.log('User not authenticated, using predefined themes');
        setAvailableThemes(localPredefinedThemes);
        return;
      }
      
      setIsLoadingThemes(true);
      
      try {
        console.log('Fetching themes from service...');
        const themesFromService = await eventService.getAvailableThemes(isAuthenticated, user?.uid || null);
        console.log('Themes fetched from service:', themesFromService.length);
        
        if (Array.isArray(themesFromService)) {
          setAvailableThemes(themesFromService);
        } else {
          console.warn('Invalid themes returned from service, using predefined themes');
          setAvailableThemes(localPredefinedThemes);
        }
      } catch (error) {
        console.error('Error refreshing available themes:', error);
        setAvailableThemes(localPredefinedThemes);
      } finally {
        setIsLoadingThemes(false);
      }
    } catch (error) {
      console.error('Unexpected error in refreshAvailableThemes:', error);
      setAvailableThemes(localPredefinedThemes);
      setIsLoadingThemes(false);
    }
  }, [isAuthenticated, user?.uid, isLoadingThemes]);
  
  useEffect(() => {
    if (availableThemes.length === 0 || availableThemes === localPredefinedThemes) {
      refreshAvailableThemes();
    }
  }, [isAuthenticated]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, loadThemeForEvent, availableThemes, refreshAvailableThemes, isLoadingThemes }}>
      {children}
    </ThemeContext.Provider>
  );
};

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Theme } from '../types/eventTypes'; // Adjusted path
import { getDefaultTheme, predefinedThemes as localPredefinedThemes } from '../constants/themes'; // Adjusted path
import * as eventService from '../services/eventService'; // Added eventService
import { useAuth } from './AuthContext'; // Added useAuth

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  loadThemeForEvent: (eventId: string | null) => Promise<void>; 
  availableThemes: Theme[]; 
  refreshAvailableThemes: () => Promise<void>; // Function to explicitly refresh themes
  isLoadingThemes: boolean;
}

const defaultTheme = getDefaultTheme();

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  setTheme: () => console.warn('setTheme function not yet implemented'),
  loadThemeForEvent: async () => console.warn('loadThemeForEvent not yet implemented'),
  availableThemes: localPredefinedThemes, // Use local import initially
  refreshAvailableThemes: async () => console.warn('refreshAvailableThemes not yet implemented'),
  isLoadingThemes: false,
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth(); // Get user and auth status
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [availableThemes, setAvailableThemes] = useState<Theme[]>(localPredefinedThemes);
  const [isLoadingThemes, setIsLoadingThemes] = useState(false);

  // Function to update the current theme
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Function to load a theme for a specific event
  // This is a placeholder. Actual implementation would fetch from a service.
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
        setThemeState(defaultTheme); // Fallback to default if no specific theme found
      }
    } catch (error) {
      console.error(`Error loading theme for event ${eventId}:`, error);
      setThemeState(defaultTheme); // Fallback on error
    } finally {
      setIsLoadingThemes(false);
    }
  }, [isAuthenticated, user?.uid]);

  const refreshAvailableThemes = useCallback(async () => {
    if (!isAuthenticated) {
      // For unauthenticated users, only predefined themes are available.
      setAvailableThemes(localPredefinedThemes);
      return;
    }
    setIsLoadingThemes(true);
    try {
      // Pass user.uid if available, otherwise null (service handles predefined if userId is null)
      const themesFromService = await eventService.getAvailableThemes(isAuthenticated, user?.uid || null);
      setAvailableThemes(themesFromService);
    } catch (error) {
      console.error('Error refreshing available themes:', error);
      setAvailableThemes(localPredefinedThemes); // Fallback to predefined on error
    } finally {
      setIsLoadingThemes(false);
    }
  }, [isAuthenticated, user?.uid]);
  
  // Load available themes when authentication status changes or user logs in
  useEffect(() => {
    refreshAvailableThemes();
  }, [refreshAvailableThemes]); // refreshAvailableThemes is stable due to useCallback

  return (
    <ThemeContext.Provider value={{ theme, setTheme, loadThemeForEvent, availableThemes, refreshAvailableThemes, isLoadingThemes }}>
      {children}
    </ThemeContext.Provider>
  );
};

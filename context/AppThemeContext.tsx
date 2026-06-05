import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCurrentUser } from '@/hooks/useUser';
import { useAuth } from '@/context/AuthContext';
import { Colors, ColorPalette } from '@/constants/Colors';

export type AppTheme = 'light' | 'dark' | 'system';

export interface AppThemeContextType {
  theme: AppTheme;
  currentColors: ColorPalette;
  setTheme: (theme: AppTheme) => void;
  isSystemDark: boolean;
}

const defaultTheme: AppTheme = 'system';
const THEME_STORAGE_KEY = '@kinshipsync_theme';

// Helper functions for AsyncStorage
const saveThemeToStorage = async (theme: AppTheme): Promise<void> => {
  try {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Failed to save theme to local storage:', error);
  }
};

const loadThemeFromStorage = async (): Promise<AppTheme | null> => {
  try {
    const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme as AppTheme | null;
  } catch (error) {
    console.warn('Failed to load theme from local storage:', error);
    return null;
  }
};

const AppThemeContext = createContext<AppThemeContextType>({
  theme: defaultTheme,
  currentColors: Colors.light,
  setTheme: () => console.warn('setTheme function not yet implemented'),
  isSystemDark: false,
});

export const useAppTheme = () => useContext(AppThemeContext);

interface AppThemeProviderProps {
  children: ReactNode;
}

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
  const { settings } = useCurrentUser();
  const { isAuthenticated } = useAuth();
  const [theme, setThemeState] = useState<AppTheme>(defaultTheme);
  const [systemTheme, setSystemTheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme() ?? 'light',
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasSyncedUserSettings, setHasSyncedUserSettings] = useState(false);

  // Initialize theme from local storage
  useEffect(() => {
    const initializeTheme = async () => {
      const storedTheme = await loadThemeFromStorage();
      if (storedTheme) {
        setThemeState(storedTheme);
      }
      setIsInitialized(true);
    };

    initializeTheme();
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme ?? 'light');
    });

    return () => subscription?.remove();
  }, []);

  // Sync with user settings only once when user first authenticates
  useEffect(() => {
    if (isInitialized && isAuthenticated && settings?.theme && !hasSyncedUserSettings) {
      // Only sync user settings to local storage on first authentication
      // After that, local storage takes precedence over server settings
      const syncTheme = async () => {
        await saveThemeToStorage(settings.theme);
        setThemeState(settings.theme);
        setHasSyncedUserSettings(true);
      };
      syncTheme();
    }
  }, [isAuthenticated, settings?.theme, isInitialized, hasSyncedUserSettings, theme]);

  // Determine the actual colors to use
  const getCurrentColors = useCallback((): ColorPalette => {
    if (theme === 'system') {
      return (systemTheme === 'dark' ? Colors.dark : Colors.light) as ColorPalette;
    }
    return (theme === 'dark' ? Colors.dark : Colors.light) as ColorPalette;
  }, [theme, systemTheme]);

  const currentColors = getCurrentColors();
  const isSystemDark = systemTheme === 'dark';

  const setTheme = async (newTheme: AppTheme) => {
    setThemeState(newTheme);
    await saveThemeToStorage(newTheme);
  };

  return (
    <AppThemeContext.Provider value={{
      theme,
      currentColors,
      setTheme,
      isSystemDark,
    }}>
      {children}
    </AppThemeContext.Provider>
  );
};

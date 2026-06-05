import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
// Icon import removed as it's not used in the provided snippet and might not be needed for this change.
// If Icon is used elsewhere in the actual file for other purposes, it should be kept.
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createThemesStyles } from '../../styles/app/(events)/themes.styles';
import { useAppTheme } from '@/context/AppThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getAvailableThemes } from '../../services/eventService';
import { Theme } from '../../types/eventTypes';
import { LoadingScreen } from '@/components/common/LoadingScreen';

const ChooseThemePage: React.FC = () => {
  const { currentColors } = useAppTheme();
  const styles = createThemesStyles(currentColors);


  const { user, isAuthenticated } = useAuth();
  const [userThemes, setUserThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null); // Store the whole theme object or just ID
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);
  const [selectedFontStyle, setSelectedFontStyle] = useState('Modern');

  const colorPalette = [
    { id: 'red', color: '#FF3B30' }, { id: 'yellow', color: '#FFCC00' }, { id: 'cyan', color: '#00FFFF' },
    { id: 'blue', color: '#0000FF' }, { id: 'magenta', color: '#FF00FF' }, { id: 'purple', color: '#6B6B8E' }
  ];

  const fontStyles = [
    { id: 'modern', name: 'Modern' }, { id: 'classic', name: 'Classic' }, { id: 'playful', name: 'Playful' }
  ];

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    router.push('/(events)/website');
  };

  useEffect(() => {
    const fetchThemes = async () => {
      if (isAuthenticated && user?.uid) {
        setIsLoading(true);
        setError(null);
        try {
          const fetchedThemes = await getAvailableThemes(isAuthenticated, user.uid);
          setUserThemes(fetchedThemes);
        } catch (err) {
          console.error("Failed to fetch themes:", err);
          setError(err instanceof Error ? err.message : 'Failed to load themes.');
        } finally {
          setIsLoading(false);
        }
      } else if (!isAuthenticated) {
        setIsLoading(true);
        setError(null);
        try {
          const predefined = await getAvailableThemes(false, null); // Fetch only predefined
          setUserThemes(predefined);
        } catch (err) {
          console.error("Failed to fetch predefined themes:", err);
          setError(err instanceof Error ? err.message : 'Failed to load themes.');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false); // Not authenticated and no user.uid
        setUserThemes([]); // Clear themes or load predefined ones
      }
    };

    fetchThemes();
  }, [user, isAuthenticated, selectedTheme]); // Added selectedTheme to dependencies if pre-selection logic uses it

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      
      <Stack.Screen options={{ title: "Choose Theme" }} />

      <View style={styles.tabContainer}>
        <View style={[styles.tabItem, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Details ✓</Text>
        </View>
        <View style={[styles.tabItem, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Themes</Text>
        </View>
        <View style={[styles.tabItem, styles.lastTab]}>
          <Text style={[styles.tabText]}>Website</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollableContent}>
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Select a Theme</Text>
          {isLoading && <LoadingScreen />}
          {error && <Text style={styles.errorText}>Error: {error}</Text>}
          {!isLoading && !error && userThemes.length === 0 && (
            <Text style={styles.emptyMessage}>No themes available. Try creating one!</Text>
          )}
          {!isLoading && !error && userThemes.map((theme) => (
            <TouchableOpacity
              key={theme.id}
              style={[styles.themeCard, selectedTheme?.id === theme.id && styles.selectedThemeCard]}
              onPress={() => setSelectedTheme(theme)}
            >
              <View style={styles.themeContent}>
                <Text style={styles.themeName}>{theme.name}</Text>
                {/* Theme description is not part of the Theme type, so it's removed. 
                    If needed, it should be added to the Theme type and fetched. */}
              </View>
              <View style={[styles.radioButton, selectedTheme?.id === theme.id && styles.radioButtonSelected]}>
                {selectedTheme?.id === theme.id && <View style={styles.radioButtonInner} />}
              </View>
            </TouchableOpacity>
          ))}

          <Text style={styles.sectionTitle}>Color Palette</Text>
          <View style={styles.colorPaletteContainer}>
            {colorPalette.map((colorItem, index) => (
              <TouchableOpacity
                key={colorItem.id}
                style={[styles.colorOption, { backgroundColor: colorItem.color }, selectedColorIndex === index && styles.selectedColorOption]}
                onPress={() => setSelectedColorIndex(index)} 
              />
            ))}
          </View>

          <Text style={styles.sectionTitle}>Font Style</Text>
          <View style={styles.fontStyleContainer}>
            {fontStyles.map((font) => (
              <TouchableOpacity
                key={font.id}
                style={[styles.fontStyleOption, selectedFontStyle === font.name && styles.selectedFontStyle]}
                onPress={() => setSelectedFontStyle(font.name)}
              >
                <Text style={[styles.fontStyleText, selectedFontStyle === font.name && styles.selectedFontStyleText]}>
                  {font.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.navigationContainer}>
            <TouchableOpacity style={styles.backNextButton} onPress={handleBack}>
              <Text style={styles.backNextButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backNextButton} onPress={handleNext}>
              <Text style={styles.backNextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView> 
    </SafeAreaView>
  );
};

export default ChooseThemePage;

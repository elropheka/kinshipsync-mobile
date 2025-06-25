import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, ActivityIndicator, SafeAreaView, StatusBar } from 'react-native'; // Added ActivityIndicator and SafeAreaView
import { Stack, router } from 'expo-router';
import { Theme, FontSettings } from '../../types/eventTypes';
import { Colors } from '../../constants/Colors';
import Fonts from '../../constants/fonts';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext'; // Import useTheme
import * as eventService from '../../services/eventService';

// Helper to generate a unique ID (simplified)
const generateId = () => `user-custom-${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`;

const CreateThemeScreen = () => {
  const { user, isAuthenticated } = useAuth();
  const { refreshAvailableThemes } = useTheme(); // Get refresh function
  const [isLoading, setIsLoading] = useState(false);
  const [themeName, setThemeName] = useState('');
  const [primaryColor, setPrimaryColor] = useState(Colors.light.primary);
  const [secondaryColor, setSecondaryColor] = useState(Colors.light.accent);
  const [accentColor, setAccentColor] = useState(Colors.light.accentHighlight);
  const [backgroundColor, setBackgroundColor] = useState(Colors.light.background);
  const [textColor, setTextColor] = useState(Colors.light.text);
  const [cardBgColor, setCardBgColor] = useState(Colors.light.backgroundPaper);
  const [borderColor, setBorderColor] = useState(Colors.light.border);

  const [headingFont, setHeadingFont] = useState<FontSettings>({
    fontFamily: Fonts.headerMedium,
    fontWeight: '500',
  });
  const [bodyFont, setBodyFont] = useState<FontSettings>({
    fontFamily: Fonts.bodyRegular,
    fontWeight: '400',
  });

  const handleSaveTheme = async () => {
    if (!isAuthenticated || !user?.uid) {
      Alert.alert('Error', 'You must be logged in to save a theme.');
      return;
    }
    if (!themeName.trim()) {
      Alert.alert('Error', 'Theme name is required.');
      return;
    }

    setIsLoading(true);

    const newTheme: Theme = {
      id: generateId(), // Firestore doc ID will be this theme.id if saveUserTheme uses it
      name: themeName.trim(),
      isPredefined: false,
      colors: {
        primary: primaryColor,
        secondary: secondaryColor,
        accent: accentColor,
        background: backgroundColor,
        text: textColor,
        cardBackground: cardBgColor,
        borderColor: borderColor,
      },
      fonts: {
        heading: headingFont,
        body: bodyFont,
      },
    };

    try {
      await eventService.saveUserTheme(isAuthenticated, user.uid, newTheme);
      await refreshAvailableThemes(); // Refresh themes in context
      Alert.alert('Theme Saved', `Theme "${newTheme.name}" has been saved successfully and added to your list.`);
      // No longer a TODO here
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(main)/home'); // Fallback navigation
      }
    } catch (error) {
      console.error('Failed to save theme:', error);
      Alert.alert('Error', 'Failed to save theme. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.backgroundPrimary} />
      <Stack.Screen options={{ title: 'Create New Theme' }} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.label}>Theme Name</Text>
        <TextInput
          style={styles.input}
          value={themeName}
          onChangeText={setThemeName}
          placeholder="e.g., My Awesome Theme"
        />

        <Text style={styles.sectionTitle}>Colors</Text>
        {/* Basic TextInputs for colors for now; replace with ColorPickers */}
        <Text style={styles.label}>Primary Color</Text>
        <TextInput style={styles.input} value={primaryColor} onChangeText={setPrimaryColor} placeholder="#RRGGBB" />

        <Text style={styles.label}>Secondary Color</Text>
        <TextInput style={styles.input} value={secondaryColor} onChangeText={setSecondaryColor} placeholder="#RRGGBB" />

        <Text style={styles.label}>Accent Color</Text>
        <TextInput style={styles.input} value={accentColor} onChangeText={setAccentColor} placeholder="#RRGGBB" />
        
        <Text style={styles.label}>Background Color</Text>
        <TextInput style={styles.input} value={backgroundColor} onChangeText={setBackgroundColor} placeholder="#RRGGBB" />

        <Text style={styles.label}>Text Color</Text>
        <TextInput style={styles.input} value={textColor} onChangeText={setTextColor} placeholder="#RRGGBB" />

        <Text style={styles.label}>Card Background Color</Text>
        <TextInput style={styles.input} value={cardBgColor} onChangeText={setCardBgColor} placeholder="#RRGGBB" />

        <Text style={styles.label}>Border Color</Text>
        <TextInput style={styles.input} value={borderColor} onChangeText={setBorderColor} placeholder="#RRGGBB" />


        <Text style={styles.sectionTitle}>Fonts</Text>
        {/* Basic TextInputs for fonts for now; replace with FontSelectors */}
        <Text style={styles.label}>Heading Font Family</Text>
        <TextInput
          style={styles.input}
          value={headingFont.fontFamily}
          onChangeText={(text) => setHeadingFont(prev => ({ ...prev, fontFamily: text }))}
          placeholder="e.g., Poppins-Bold"
        />
        {/* Add inputs for fontWeight, fontStyle if needed, or use a proper selector */}

        <Text style={styles.label}>Body Font Family</Text>
        <TextInput
          style={styles.input}
          value={bodyFont.fontFamily}
          onChangeText={(text) => setBodyFont(prev => ({ ...prev, fontFamily: text }))}
          placeholder="e.g., Poppins-Regular"
        />
        {/* Add inputs for fontWeight, fontStyle if needed, or use a proper selector */}
        
        <View style={styles.buttonContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color={Colors.light.primary} />
          ) : (
            <Button title="Save Theme" onPress={handleSaveTheme} color={Colors.light.primary} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  contentContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: Colors.light.backgroundPaper,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
    paddingBottom: 5,
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
});

export default CreateThemeScreen;

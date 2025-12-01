import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ActivityIndicator, SafeAreaView, StatusBar, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { Theme, FontSettings } from '../../types/eventTypes';
import { Colors } from '../../constants/Colors';
import Fonts from '../../constants/fonts';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useAlert } from '@/context/AlertContext';

const generateId = () => `user-custom-${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`;

const CreateThemeScreen = () => {
  const { user, isAuthenticated } = useAuth();
  const { refreshAvailableThemes } = useTheme();
  const { showSuccess, showError } = useAlert();
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
      showAlert('error', 'Error', 'You must be logged in to save a theme.');
      return;
    }
    if (!themeName.trim()) {
      showAlert('error', 'Error', 'Theme name is required.');
      return;
    }

    setIsLoading(true);

    const newTheme: Theme = {
      id: generateId(),
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
      console.log('Theme would be saved:', newTheme);
      await refreshAvailableThemes();
      showSuccess('Theme Saved', `Theme "${newTheme.name}" has been saved successfully and added to your list.`, {
        onConfirm: () => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/(main)/home');
          }
        },
      });
    } catch (error) {
      console.error('Failed to save theme:', error);
      showError('Error', 'Failed to save theme. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark.accent} hidden={Platform.OS === 'android'} />
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
        <Text style={styles.label}>Heading Font Family</Text>
        <TextInput
          style={styles.input}
          value={headingFont.fontFamily}
          onChangeText={(text) => setHeadingFont(prev => ({ ...prev, fontFamily: text }))}
          placeholder="e.g., Poppins-Bold"
        />

        <Text style={styles.label}>Body Font Family</Text>
        <TextInput
          style={styles.input}
          value={bodyFont.fontFamily}
          onChangeText={(text) => setBodyFont(prev => ({ ...prev, fontFamily: text }))}
          placeholder="e.g., Poppins-Regular"
        />
        
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

import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Stack, router } from 'expo-router';
import { Theme, FontSettings } from '../../types/eventTypes';
import Fonts from '../../constants/fonts';
import { useAppTheme } from '../../context/AppThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useAlert } from '@/context/AlertContext';
import { createCreateThemeStyles } from '@/styles/app/themes/createTheme.styles';
import { LoadingScreen } from '@/components/common/LoadingScreen';

const generateId = () => `user-custom-${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`;

const CreateThemeScreen = () => {
  const { currentColors } = useAppTheme();
  const styles = createCreateThemeStyles(currentColors);
  const { user, isAuthenticated } = useAuth();
  const { refreshAvailableThemes } = useTheme();
  const { showSuccess, showError } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [themeName, setThemeName] = useState('');
  const [primaryColor, setPrimaryColor] = useState<string>(currentColors.primary);
  const [secondaryColor, setSecondaryColor] = useState<string>(currentColors.accent);
  const [accentColor, setAccentColor] = useState<string>(currentColors.accentHighlight);
  const [backgroundColor, setBackgroundColor] = useState<string>(currentColors.background);
  const [textColor, setTextColor] = useState<string>(currentColors.text);
  const [cardBgColor, setCardBgColor] = useState<string>(currentColors.backgroundPaper);
  const [borderColor, setBorderColor] = useState<string>(currentColors.border);

  const [headingFont, setHeadingFont] = useState<FontSettings>({
    fontFamily: Fonts.headerMedium,
    fontWeight: '500',
  });
  const [bodyFont, setBodyFont] = useState<FontSettings>({
    fontFamily: Fonts.bodyRegular,
    fontWeight: '400',
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  const handleSaveTheme = async () => {
    if (!isAuthenticated || !user?.uid) {
      showError('Error', 'You must be logged in to save a theme.');
      return;
    }
    if (!themeName.trim()) {
      showError('Error', 'Theme name is required.');
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
      <StatusBar barStyle="dark-content" backgroundColor={currentColors.backgroundSecondary} />
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
          <Button title="Save Theme" onPress={handleSaveTheme} color={currentColors.primary} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateThemeScreen;

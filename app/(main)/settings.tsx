import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from 'constants/Colors';
import { styles } from '../../styles/app/(main)/settings.styles';
import { useCurrentUser } from '../../hooks/useUser';
import { UserSettings, UpdateUserSettingsPayload } from '../../types/userTypes';
import { useAuth } from '../../context/AuthContext';

interface SettingOptionProps {
  title: string;
  value: boolean;
  onToggle: (newValue: boolean) => void;
  description?: string;
}

const SettingOption: React.FC<SettingOptionProps> = ({ title, value, onToggle, description }) => (
  <View style={styles.optionContainer}>
    <View style={styles.optionTextContainer}>
      <Text style={styles.optionText}>{title}</Text>
      {description && <Text style={styles.optionDescription}>{description}</Text>}
    </View>
    <Switch 
      value={value} 
      onValueChange={onToggle}
      trackColor={{ false: Colors.light.icon, true: Colors.light.tint }}
      thumbColor={value ? Colors.light.backgroundLight : Colors.light.backgroundLight} 
    />
  </View>
);

interface ThemeOptionProps {
  title: string;
  currentTheme: UserSettings['theme'];
  onSelectTheme: (theme: UserSettings['theme']) => void;
}
const ThemeOption: React.FC<ThemeOptionProps> = ({ title, currentTheme, onSelectTheme }) => {
  const themes: UserSettings['theme'][] = ['light', 'dark', 'system'];
  return (
    <View style={styles.optionContainer}>
      <Text style={styles.optionText}>{title}</Text>
      <View style={styles.themeSelector}>
        {themes.map(theme => (
          <TouchableOpacity 
            key={theme} 
            style={[styles.themeButton, currentTheme === theme && styles.themeButtonSelected]}
            onPress={() => onSelectTheme(theme)}
          >
            <Text style={[styles.themeButtonText, currentTheme === theme && styles.themeButtonTextSelected]}>
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};


const SettingsScreen: React.FC = () => {
  const router = useRouter();
  const { signOut } = useAuth();
  const { 
    settings: currentSettings, 
    updateSettings, 
    isLoading: isLoadingSettings, 
    error: settingsError 
  } = useCurrentUser();

  const [editableSettings, setEditableSettings] = useState<Partial<UpdateUserSettingsPayload>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentSettings) {
      setEditableSettings({
        theme: currentSettings.theme,
        language: currentSettings.language,
        emailNotifications: { ...currentSettings.emailNotifications },
        pushNotifications: { ...currentSettings.pushNotifications },
      });
    }
  }, [currentSettings]);

  const handleSettingChange = (
    category: keyof UpdateUserSettingsPayload, 
    key: string | undefined,
    value: any
  ) => {
    setEditableSettings(prev => {
      if (key && (category === 'emailNotifications' || category === 'pushNotifications')) {
        return {
          ...prev,
          [category]: {
            ...(prev[category] as any),
            [key]: value,
          },
        };
      }
      return { ...prev, [category]: value };
    });
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const payload: UpdateUserSettingsPayload = {
        theme: editableSettings.theme,
        language: editableSettings.language,
        emailNotifications: editableSettings.emailNotifications,
        pushNotifications: editableSettings.pushNotifications,
      };
      await updateSettings(payload);
      Alert.alert("Success", "Settings updated successfully.");
    } catch (error) {
      console.error("Failed to update settings:", error);
      Alert.alert("Error", "Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/(auth)/signIn'); 
    } catch (error) {
      Alert.alert("Logout Failed", "Could not log out. Please try again.");
    }
  };
  
  if (isLoadingSettings && !currentSettings) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.dark.accent}/>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text>Loading Settings...</Text>
      </SafeAreaView>
    );
  }

  if (settingsError) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.dark.accent}/>
        <Text style={styles.errorText}>Error loading settings: {settingsError.message}</Text>
      </SafeAreaView>
    );
  }
  
  const displaySettings = editableSettings.theme ? editableSettings : currentSettings || {
    theme: 'system',
    language: 'en',
    emailNotifications: { eventInvites: true, eventUpdates: true, messageAlerts: true, newsletter: true },
    pushNotifications: { eventInvites: true, eventUpdates: true, messageAlerts: true, taskAlerts: true },
  };


  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: "Settings" }} />
     <StatusBar barStyle="dark-content" backgroundColor={Colors.dark.accent}/>

      <ScrollView>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <ThemeOption 
            title="Theme"
            currentTheme={displaySettings.theme!}
            onSelectTheme={(theme) => handleSettingChange('theme', undefined, theme)}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Email Notifications</Text>
          <SettingOption
            title="Event Invites"
            value={!!displaySettings.emailNotifications?.eventInvites}
            onToggle={(val) => handleSettingChange('emailNotifications', 'eventInvites', val)}
          />
          <SettingOption
            title="Event Updates"
            value={!!displaySettings.emailNotifications?.eventUpdates}
            onToggle={(val) => handleSettingChange('emailNotifications', 'eventUpdates', val)}
          />
          <SettingOption
            title="Message Alerts"
            value={!!displaySettings.emailNotifications?.messageAlerts}
            onToggle={(val) => handleSettingChange('emailNotifications', 'messageAlerts', val)}
          />
          {/* <SettingOption
            title="Newsletter"
            value={!!displaySettings.emailNotifications?.newsletter}
            onToggle={(val) => handleSettingChange('emailNotifications', 'newsletter', val)}
          /> */}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Push Notifications</Text>
          <SettingOption
            title="Event Invites"
            value={!!displaySettings.pushNotifications?.eventInvites}
            onToggle={(val) => handleSettingChange('pushNotifications', 'eventInvites', val)}
          />
          <SettingOption
            title="Event Updates"
            value={!!displaySettings.pushNotifications?.eventUpdates}
            onToggle={(val) => handleSettingChange('pushNotifications', 'eventUpdates', val)}
          />
          <SettingOption
            title="Message Alerts"
            value={!!displaySettings.pushNotifications?.messageAlerts}
            onToggle={(val) => handleSettingChange('pushNotifications', 'messageAlerts', val)}
          />
          <SettingOption
            title="Task Alerts"
            value={!!displaySettings.pushNotifications?.taskAlerts}
            onToggle={(val) => handleSettingChange('pushNotifications', 'taskAlerts', val)}
          />
        </View>
        
        {/* <View style={styles.sectionContainer}>
             <TouchableOpacity style={styles.linkOptionContainer} onPress={() => router.push('/(main)/subscriptionPlans')}>
                <Text style={styles.optionText}>Subscription Plans</Text>
                <Ionicons name="chevron-forward" size={22} color={Colors.light.icon} />
            </TouchableOpacity>
        </View> */}

        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSaveSettings} disabled={isSaving}>
          {isSaving ? <ActivityIndicator color="#fff"/> : <Text style={styles.buttonText}>Save Settings</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
            <Text style={[styles.buttonText, styles.logoutButtonText]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

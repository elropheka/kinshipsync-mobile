import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, ActivityIndicator, StatusBar, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { Colors } from 'constants/Colors';
import { styles } from '@/styles/app/(main)/settings.styles';
import { useCurrentUser } from '@/hooks/useUser';
import { UserSettings, UpdateUserSettingsPayload } from '@/types/userTypes';
import { useAuth } from '@/context/AuthContext';
import { setEventVisibility } from '../../store/slices/eventVisibilitySlice';
import { useAlert } from '@/context/AlertContext';

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
  const dispatch = useDispatch();
  const { signOut } = useAuth();
  const { showSuccess, showError } = useAlert();
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
        eventVisibility: { ...currentSettings.eventVisibility },
      });

      if (currentSettings.eventVisibility) {
        console.log('Settings: Initializing Redux state with current settings:', currentSettings.eventVisibility.showAllPublicEvents);
        dispatch(setEventVisibility({ 
          showAllPublicEvents: currentSettings.eventVisibility.showAllPublicEvents 
        }));
      }
    }
  }, [currentSettings, dispatch]);

  const handleSettingChange = async (
    category: keyof UpdateUserSettingsPayload, 
    key: string | undefined,
    value: any
  ) => {
    console.log('Settings: Setting changed:', { category, key, value });
    
    const newEditableSettings = (() => {
      if (key && (category === 'emailNotifications' || category === 'pushNotifications' || category === 'eventVisibility')) {
        return {
          ...editableSettings,
          [category]: {
            ...(editableSettings[category] as any),
            [key]: value,
          },
        };
      }
      return { ...editableSettings, [category]: value };
    })();
    
    setEditableSettings(newEditableSettings);
    console.log('Settings: New editable settings:', newEditableSettings);

    if (category === 'eventVisibility' && key === 'showAllPublicEvents') {
      console.log('Settings: Dispatching Redux action for event visibility change:', value);
      dispatch(setEventVisibility({ showAllPublicEvents: value }));
    }

    try {
      const payload: UpdateUserSettingsPayload = {
        theme: newEditableSettings.theme,
        language: newEditableSettings.language,
        emailNotifications: newEditableSettings.emailNotifications,
        pushNotifications: newEditableSettings.pushNotifications,
        eventVisibility: newEditableSettings.eventVisibility,
      };
      console.log('Settings: Auto-saving settings payload:', payload);
      const updatedSettings = await updateSettings(payload);
      console.log('Settings: Settings auto-saved successfully:', updatedSettings);
    } catch (error) {
      console.error("Failed to auto-save settings:", error);
      setEditableSettings(editableSettings);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const payload: UpdateUserSettingsPayload = {
        theme: editableSettings.theme,
        language: editableSettings.language,
        emailNotifications: editableSettings.emailNotifications,
        pushNotifications: editableSettings.pushNotifications,
        eventVisibility: editableSettings.eventVisibility,
      };
      console.log('Settings: Manual save settings payload:', payload);
      const updatedSettings = await updateSettings(payload);
      console.log('Settings: Settings manually saved successfully:', updatedSettings);
      showSuccess("Success", "Settings updated successfully.");
    } catch (error) {
      console.error("Failed to update settings:", error);
      showError("Error", "Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/(auth)/signIn'); 
    } catch {
      showError("Logout Failed", "Could not log out. Please try again.");
    }
  };
  
  if (isLoadingSettings && !currentSettings) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.dark.accent} hidden={Platform.OS === 'android'}/>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text>Loading Settings...</Text>
      </SafeAreaView>
    );
  }

  if (settingsError) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.dark.accent} hidden={Platform.OS === 'android'}/>
        <Text style={styles.errorText}>Error loading settings: {settingsError.message}</Text>
      </SafeAreaView>
    );
  }
  
  const displaySettings = editableSettings.theme ? editableSettings : currentSettings || {
    theme: 'system',
    language: 'en',
    emailNotifications: { eventInvites: true, eventUpdates: true, messageAlerts: true, newsletter: true },
    pushNotifications: { eventInvites: true, eventUpdates: true, messageAlerts: true, taskAlerts: true },
    eventVisibility: { showAllPublicEvents: false },
  };


  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: "Settings" }} />
     <StatusBar barStyle="light-content" backgroundColor={Colors.dark.accent} hidden={Platform.OS === 'android'}/>

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

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Event Visibility</Text>
          <SettingOption
            title="Show All Public Events"
            value={!!displaySettings.eventVisibility?.showAllPublicEvents}
            onToggle={(val) => handleSettingChange('eventVisibility', 'showAllPublicEvents', val)}
            description="When enabled, you'll see all public events. When disabled, you'll only see events you're invited to or organizing."
          />
        </View>

        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSaveSettings} disabled={isSaving}>
          {isSaving ? <ActivityIndicator color="#fff"/> : <Text style={styles.buttonText}>Settings Auto-Saved</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
            <Text style={[styles.buttonText, styles.logoutButtonText]}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.deleteAccountButton]} 
          onPress={() => router.push('/(auth)/deleteAccount')}
        >
          <Text style={[styles.buttonText, styles.deleteAccountButtonText]}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

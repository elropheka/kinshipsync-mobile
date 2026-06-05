import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, ActivityIndicator, Modal } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { createCreateEventStyles } from '@/styles/app/(events)/createEvent.styles';
import { useAppTheme } from '@/context/AppThemeContext';
import { useEventDetail } from '@/hooks/useEvents'; 
import { 
  Event as EventType,
  UpdateEventPayload,
  UpdateEventWebsiteDetailsPayload 
} from '@/types/eventTypes';
import { UserProfile } from '@/types/userTypes';
import { useAppAuth } from '@/hooks/useAppAuth'; 
import { useTheme } from '@/context/ThemeContext'; 
import MultiUserPicker from '@/components/common/MultiUserPicker';
import * as userService from '@/services/userService';
import { useAlert } from '@/context/AlertContext';
import { LoadingScreen } from '@/components/common/LoadingScreen';

const EventWebsiteFormFallback = ({ initialWebsiteData: _initialWebsiteData, onSubmit: _onSubmit, onCancel: _onCancel }: any) => (
  <View style={{ padding: 20, alignItems: 'center' }}>
    <Text style={{ color: 'red', fontSize: 16 }}>Error loading website form</Text>
    <Text style={{ color: 'red', fontSize: 14, marginTop: 10 }}>Please try again or go back</Text>
  </View>
);

EventWebsiteFormFallback.displayName = 'EventWebsiteFormFallback';

const EditEventScreen = () => {
  const { currentColors } = useAppTheme();
  const styles = createCreateEventStyles(currentColors);


  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const { user: currentUser } = useAppAuth();
  const { showSuccess, showError } = useAlert();
  
  const { event, updateThisEvent, isLoading: isLoadingEvent, fetchEventDetails } = useEventDetail(eventId);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);

 
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [time, setTime] = useState(''); 
  const [visibility, setVisibility] = useState<EventType['visibility']>('private');
  const [allowedUserIds, setAllowedUserIds] = useState<string[]>([]);
  const [isUserPickerVisible, setIsUserPickerVisible] = useState(false);
  const [allUsersForPicker, setAllUsersForPicker] = useState<UserProfile[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);


  const themeContext = useTheme();
  const availableThemes = useMemo(() => themeContext.availableThemes || [], [themeContext.availableThemes]);
  const isLoadingThemes = themeContext.isLoadingThemes || false;
  const refreshAvailableThemes = themeContext.refreshAvailableThemes || null;
  const currentGlobalTheme = themeContext.theme || null;
  const [selectedThemeId, setSelectedThemeId] = useState<string | undefined>(undefined);

  const [eventWebsiteData] = useState<Partial<UpdateEventWebsiteDetailsPayload>>({});

  const [showPicker, setShowPicker] = useState<'date' | 'time' | 'none'>('none');

  useEffect(() => {
    if (event) {
      setName(event.name || '');
      setDescription(event.description || '');
      setLocation(event.location || '');
      setSelectedDate(new Date(event.date));
      setTime(event.time || '');
      setVisibility(event.visibility || 'private');
      setAllowedUserIds(event.allowedUserIds || []);
      setSelectedThemeId(event.themeId);
    }
  }, [event]);

  useEffect(() => {
    if (event && currentUser && event.organizerId !== currentUser.uid) {
      showError('Access Denied', 'Only the event organizer can edit this event.', {
        onConfirm: () => router.back(),
      });
    }
  }, [event, currentUser, router, showError]);

  useEffect(() => {
    if (currentStep === 2) {
      console.log('Step 2 reached, checking themes...', { 
        availableThemesCount: availableThemes.length, 
        isLoadingThemes 
      });
      
      const loadThemes = async () => {
        try {
          if (availableThemes.length === 0 && refreshAvailableThemes) {
            console.log('No themes available, fetching...');
            await refreshAvailableThemes();
          } else {
            console.log('Themes already available, skipping fetch');
          }
        } catch (error) {
          console.error('Failed to refresh themes:', error);
          console.log('Setting fallback themes to prevent crash');
        }
      };
      
      try {
        loadThemes();
      } catch (error) {
        console.error('Unexpected error in loadThemes:', error);
      }
    }
  }, [currentStep, availableThemes.length, isLoadingThemes, refreshAvailableThemes]);

  useEffect(() => {
    if (currentStep === 2 && availableThemes.length > 0 && !selectedThemeId) {
      const firstTheme = availableThemes[0];
      if (firstTheme && firstTheme.id && firstTheme.name) {
        setSelectedThemeId(firstTheme.id);
        console.log('Setting default theme:', firstTheme);
      } else if (currentGlobalTheme && availableThemes.find(t => t.id === currentGlobalTheme.id)) {
        setSelectedThemeId(currentGlobalTheme.id);
        console.log('Setting current global theme:', currentGlobalTheme);
      }
    }
  }, [currentStep, availableThemes, selectedThemeId, currentGlobalTheme]);

  useEffect(() => {
    console.log('Step changed to:', currentStep);
    if (currentStep === 3) {
      console.log('Step 3 reached - preparing to render website form');
      console.log('Current state:', {
        eventWebsiteData,
        selectedThemeId,
        availableThemesCount: availableThemes.length
      });
    }
  }, [currentStep, eventWebsiteData, selectedThemeId, availableThemes.length]);

  const onDateTimeChange = (event: DateTimePickerEvent, value?: Date) => {
    if (value) {
      if (showPicker === 'date') {
        setSelectedDate(value);
      } else if (showPicker === 'time') {
        setTime(value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    }
  };

  const handlePickerDismiss = () => {
    setShowPicker('none');
  };
  
  const handleNextStep = () => {
    try {
      console.log('handleNextStep called', { currentStep, name: name.trim(), selectedDate });
      
      if (currentStep === 1) {
        if (!name.trim()) {
          showError('Error', 'Event name is required.');
          return;
        }
        if (!selectedDate) {
          showError('Error', 'Event date is required.');
          return;
        }
        
        console.log('Step 1 validation passed, moving to step 2');
        setCurrentStep(2);
      } else if (currentStep === 2) {
        console.log('Step 2 validation passed, moving to step 3');
        setCurrentStep(3);
      }
    } catch (error) {
      console.error('Error in handleNextStep:', error);
      showError('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleUpdateEvent = async () => {
    if (!currentUser?.uid) {
      showError('Error', 'User not authenticated. Cannot update event.');
      return;
    }
    if (!event) {
      showError('Error', 'Event not found.');
      return;
    }
    if (!selectedDate) {
      showError('Error', 'Event date is required.');
      return;
    }
    
    if (selectedThemeId) {
      const selectedTheme = availableThemes.find(t => t.id === selectedThemeId);
      if (!selectedTheme) {
        showError('Error', 'Selected theme is no longer available. Please select a different theme.');
        return;
      }
      console.log('Validating selected theme:', selectedTheme);
    }

    const finalAllowedUserIds = visibility === 'private' ? (Array.isArray(allowedUserIds) ? allowedUserIds : []) : [];
    
    const payload: UpdateEventPayload = {
      name: name.trim(),
      date: selectedDate.toISOString(),
      ...(description.trim() ? { description: description.trim() } : {}),
      ...(location.trim() ? { location: location.trim() } : {}),
      ...(time.trim() ? { time: time.trim() } : {}),
      visibility: visibility,
      allowedUserIds: finalAllowedUserIds,
      themeId: selectedThemeId,
    };
    
    console.log('Updating event with payload:', payload);
    console.log('Selected theme ID:', selectedThemeId);
    console.log('Available themes:', availableThemes);

    setIsUpdating(true);
    try {
      if (!updateThisEvent) {
        throw new Error('updateThisEvent function not available');
      }
      if (!currentUser?.uid) {
        throw new Error('Current user not available');
      }
      
      console.log('Calling updateThisEvent with payload:', payload);
      await updateThisEvent(payload);
      console.log('Event updated successfully');
      
      const eventServiceRef = await import('../../services/eventService');
      if (Object.keys(eventWebsiteData).length > 0 && event.id) {
        await eventServiceRef.updateEventWebsite(!!currentUser, event.id, eventWebsiteData as UpdateEventWebsiteDetailsPayload);
      }
      
      console.log('Refetching event details after update...');
      if (fetchEventDetails) {
        await fetchEventDetails();
        console.log('Event details refetched successfully');
      }
      
      // Navigate to event details screen immediately after successful update
      if (event?.id) {
        showSuccess('Success', 'Event updated successfully!');
        router.replace({ pathname: '/(events)/details/[id]', params: { id: event.id } });
      } else {
        showSuccess('Success', 'Event updated successfully!', {
          onConfirm: () => {
            router.back();
          },
        });
      }
    } catch (error) {
      console.error("Failed to update event:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        payload: payload,
        selectedThemeId,
        availableThemes
      });
      showError('Error', 'An unexpected error occurred during update.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const renderStep1Details = () => (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Event Name <Text style={styles.requiredStar}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Enter event name..."
          placeholderTextColor={currentColors.textSecondary}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Date <Text style={styles.requiredStar}>*</Text></Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowPicker('date')}>
          <View style={styles.datePickerContainer}>
            <Text style={selectedDate ? styles.datePickerTextSelected : styles.datePickerText}>
              {selectedDate.toLocaleDateString() || 'Select Date'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={currentColors.icon} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Time</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowPicker('time')}>
          <View style={styles.datePickerContainer}>
            <Text style={time ? styles.datePickerTextSelected : styles.datePickerText}>
              {time || 'Select Time'}
            </Text>
            <Ionicons name="time-outline" size={20} color={currentColors.icon} />
          </View>
        </TouchableOpacity>
      </View>

      {showPicker !== 'none' && (
        <View>
          <DateTimePicker
            testID="dateTimePicker"
            value={showPicker === 'date' ? selectedDate : new Date()}
            mode={showPicker}
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateTimeChange}
          />
          <TouchableOpacity 
            style={{ 
              backgroundColor: currentColors.primary, 
              padding: 10, 
              borderRadius: 5, 
              marginTop: 10,
              alignItems: 'center'
            }} 
            onPress={handlePickerDismiss}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Done</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Location (Venue)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter location or venue..."
          placeholderTextColor={currentColors.textSecondary}
          value={location}
          onChangeText={setLocation}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Visibility</Text>
        <View style={styles.visibilitySelectorContainer}>
          {(['public', 'private', 'unlisted'] as Array<EventType['visibility']>).map(visOption => (
            <TouchableOpacity
              key={visOption}
              style={[
                styles.visibilityOptionButton,
                visibility === visOption && styles.visibilityOptionButtonSelected,
              ]}
              onPress={() => setVisibility(visOption)}
            >
              <Text
                style={[
                  styles.visibilityOptionText,
                  visibility === visOption && styles.visibilityOptionTextSelected,
                ]}
              >
                {visOption.charAt(0).toUpperCase() + visOption.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {visibility === 'private' && (
        <View style={styles.inputContainer}>
          <TouchableOpacity 
            style={styles.input}
            onPress={async () => {
              if (!allUsersForPicker.length) {
                setIsLoadingUsers(true);
                try {
                  const users = await userService.getAllUsersForPicker(!!currentUser);
                  setAllUsersForPicker(users);
                } catch (err) {
                  console.error("Failed to fetch users for picker:", err);
                  showError("Error", "Could not load users to select from.");
                } finally {
                  setIsLoadingUsers(false);
                }
              }
              setIsUserPickerVisible(true);
            }}
          >
            <Text style={styles.datePickerTextSelected}>
              Manage Allowed Viewers ({allowedUserIds.length} selected)
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Description</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Add a description for your event..."
          placeholderTextColor={currentColors.textSecondary}
          value={description}
          onChangeText={setDescription}
          multiline={true}
          numberOfLines={4}
        />
      </View>
    </>
  );

  const renderStep2Themes = () => {
    try {
      console.log('Rendering step 2 themes', { 
        availableThemesCount: availableThemes.length, 
        isLoadingThemes,
        selectedThemeId 
      });
      
      return (
        <>
          <Text style={styles.inputLabel}>Select a Theme</Text>
          {isLoadingThemes && <ActivityIndicator />}
          
          {Array.isArray(availableThemes) && availableThemes.length > 0 ? (
            availableThemes.map(theme => {
              try {
                if (!theme || !theme.id || !theme.name) {
                  console.warn('Invalid theme object:', theme);
                  return null;
                }
                
                return (
                  <TouchableOpacity 
                    key={theme.id} 
                    style={[styles.themeItemButton, selectedThemeId === theme.id && styles.themeItemButtonSelected]}
                    onPress={() => {
                      try {
                        setSelectedThemeId(theme.id);
                        console.log('Theme selected:', theme.id);
                      } catch (error) {
                        console.error('Error setting selected theme:', error);
                      }
                    }}
                  >
                    <Text style={selectedThemeId === theme.id ? styles.themeItemTextSelected : styles.themeItemText}>
                      {theme.name}
                    </Text>
                  </TouchableOpacity>
                );
              } catch (error) {
                console.error('Error rendering individual theme:', error);
                return null;
              }
            })
          ) : (
            <Text>No themes available.</Text>
          )}
        </>
      );
    } catch (error) {
      console.error('Error rendering step 2 themes:', error);
      return (
        <>
          <Text style={styles.inputLabel}>Select a Theme</Text>
          <Text style={{ color: 'red' }}>Error loading themes. Please try again.</Text>
        </>
      );
    }
  };

  const renderStep3Website = () => {
    try {
      console.log('Starting to render step 3 website...');
      
      const safeEventWebsiteData = eventWebsiteData || {};
      console.log('Safe event website data:', safeEventWebsiteData);
      
      return (
        <>
          <Text style={styles.inputLabel}>Customize Your Event Website</Text>
          <Text style={{ fontSize: 14, marginTop: 10, marginBottom: 20 }}>
            Website customization will be available in the next update.
          </Text>
          
          <View style={{ padding: 20, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
              Event: {name || 'Untitled Event'}
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 10 }}>
              Selected Theme: {selectedThemeId || 'None'}
            </Text>
            <Text style={{ fontSize: 14 }}>
              Step 3 completed successfully!
            </Text>
          </View>
        </>
      );
    } catch (error) {
      console.error('Error rendering step 3 website:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        eventWebsiteData
      });
      
      return (
        <>
          <Text style={styles.inputLabel}>Customize Your Event Website</Text>
          <Text style={{ color: 'red', fontSize: 14, marginTop: 10 }}>Error loading website form. Please try again.</Text>
          <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>
            Error: {error instanceof Error ? error.message : String(error)}
          </Text>
        </>
      );
    }
  };

  if (isLoadingEvent) {
    return <LoadingScreen />;
  }

  if (!event) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: currentColors.error, fontSize: 16 }}>Event not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: currentColors.primary }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: "Edit Event" }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => currentStep === 1 ? router.back() : handlePreviousStep()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={currentColors.tint} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Event - Step {currentStep}</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.tabContainer}>
        <View style={[styles.tabItem, currentStep === 1 && styles.activeTab]}>
          <Text style={[styles.tabText, currentStep === 1 && styles.activeTabText]}>Details</Text>
        </View>
        <View style={[styles.tabItem, currentStep === 2 && styles.activeTab]}>
          <Text style={[styles.tabText, currentStep === 2 && styles.activeTabText]}>Theme</Text>
        </View>
        <View style={[styles.tabItem, currentStep === 3 && styles.activeTab]}>
          <Text style={[styles.tabText, currentStep === 3 && styles.activeTabText]}>Website</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollableContent}>
        <View style={styles.formContainer}>
          {(() => {
            try {
              if (currentStep === 1) {
                return renderStep1Details();
              } else if (currentStep === 2) {
                return renderStep2Themes();
              } else if (currentStep === 3) {
                try {
                  console.log('Attempting to render step 3...');
                  return renderStep3Website();
                } catch (error) {
                  console.error('Error in step 3 rendering:', error);
                  return (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                      <Text style={{ color: 'red', fontSize: 16 }}>Error rendering step 3</Text>
                      <Text style={{ color: 'red', fontSize: 14, marginTop: 10 }}>
                        {error instanceof Error ? error.message : String(error)}
                      </Text>
                    </View>
                  );
                }
              }
              return null;
            } catch (error) {
              console.error('Error rendering step content:', error);
              return (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={{ color: 'red', fontSize: 16 }}>Error rendering step {currentStep}</Text>
                  <Text style={{ color: 'red', fontSize: 14, marginTop: 10 }}>Please try again or go back</Text>
                </View>
              );
            }
          })()}

          <View style={{ flexDirection: 'row', justifyContent: currentStep > 1 ? 'space-between' : 'flex-end', marginTop: 20 }}>
            {currentStep > 1 && (
              <TouchableOpacity style={[styles.nextButton, styles.previousButton]} onPress={handlePreviousStep}>
                <Text style={styles.previousButtonText}>Previous</Text>
              </TouchableOpacity>
            )}
            {currentStep < 3 ? (
              <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.nextButton, isUpdating && styles.disabledButton]} 
                onPress={handleUpdateEvent}
                disabled={isUpdating}
              >
                {isUpdating ? <ActivityIndicator color="#fff" /> : <Text style={styles.nextButtonText}>Update Event</Text>}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={isUserPickerVisible}
        animationType="slide"
        onRequestClose={() => setIsUserPickerVisible(false)}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setIsUserPickerVisible(false)} style={styles.backButton}>
              <Ionicons name="close-outline" size={28} color={currentColors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Select Viewers</Text>
            <TouchableOpacity onPress={() => setIsUserPickerVisible(false)} style={styles.backButton} >
              <Text style={{color: currentColors.primary, fontSize: 16, fontWeight: '600'}}>Done</Text>
            </TouchableOpacity>
          </View>
          {isLoadingUsers ? (
            <ActivityIndicator style={{marginTop: 20}} size="large" color={currentColors.primary} />
          ) : (
            <MultiUserPicker
              users={allUsersForPicker.filter(u => u.userId !== currentUser?.uid)}
              selectedUserIds={allowedUserIds}
              onSelectionChange={(ids) => setAllowedUserIds(ids)}
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default EditEventScreen;

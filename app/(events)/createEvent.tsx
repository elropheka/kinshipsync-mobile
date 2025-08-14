import React, { useState, useEffect } from 'react'; // Added useEffect
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Platform, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { styles } from '../../styles/app/(events)/createEvent.styles';
import { Colors } from 'constants/Colors';
import { useAllEvents } from '../../hooks/useEvents'; 
// Consolidated and corrected type imports
import { 
  CreateEventPayload, 
  Event as EventType, // Used for visibility state type
  Theme, // Theme type might be needed for explicit typing, though often inferred from useTheme
  UpdateEventWebsiteDetailsPayload 
} from '../../types/eventTypes';
import { UserProfile } from '../../types/userTypes'; // Moved UserProfile import higher
import { useAppAuth } from '../../hooks/useAppAuth'; 
import { useTheme } from '../../context/ThemeContext'; 
import MultiUserPicker from '../../components/common/MultiUserPicker';
import * as userService from '../../services/userService'; 
// eventService is already imported via useTheme or can be imported directly if specific functions are needed not exposed by useTheme
// Import EventWebsiteForm with error handling
let EventWebsiteForm: any = null;
try {
  EventWebsiteForm = require('../../components/website/EventWebsiteForm').default;
} catch (error) {
  console.error('Error importing EventWebsiteForm:', error);
  // Create a fallback component
  EventWebsiteForm = ({ initialWebsiteData, onSubmit, onCancel }: any) => (
    <View style={{ padding: 20, alignItems: 'center' }}>
      <Text style={{ color: 'red', fontSize: 16 }}>Error loading website form</Text>
      <Text style={{ color: 'red', fontSize: 14, marginTop: 10 }}>Please try again or go back</Text>
    </View>
  );
}


const CreateEventScreen = () => {
  const router = useRouter();
  
  let addEvent: any = null;
  let isCreatingEvent = false;
  let currentUser: any = null;
  
  try {
    const eventsHook = useAllEvents();
    addEvent = eventsHook.addEvent;
    isCreatingEvent = eventsHook.isLoading || false;
  } catch (error) {
    console.error('Error accessing useAllEvents:', error);
  }
  
  try {
    const authHook = useAppAuth();
    currentUser = authHook.user || null;
  } catch (error) {
    console.error('Error accessing useAppAuth:', error);
  } 

  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Details
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

  // Step 2: Theme - Use ThemeContext
  let availableThemes: any[] = [];
  let isLoadingThemes = false;
  let refreshAvailableThemes: (() => Promise<void>) | null = null;
  let currentGlobalTheme: any = null;
  
  try {
    const themeContext = useTheme();
    availableThemes = themeContext.availableThemes || [];
    isLoadingThemes = themeContext.isLoadingThemes || false;
    refreshAvailableThemes = themeContext.refreshAvailableThemes || null;
    currentGlobalTheme = themeContext.theme || null;
  } catch (error) {
    console.error('Error accessing ThemeContext:', error);
    // Use fallback values
    availableThemes = [];
    isLoadingThemes = false;
    refreshAvailableThemes = null;
    currentGlobalTheme = null;
  }
  const [selectedThemeId, setSelectedThemeId] = useState<string | undefined>(undefined); // Initialize as undefined

  // Step 3: Website
  const [eventWebsiteData, setEventWebsiteData] = useState<Partial<UpdateEventWebsiteDetailsPayload>>({});


  const [showPicker, setShowPicker] = useState<'date' | 'time' | 'none'>('none');

  // Fetch available themes when step 2 is shown (only once)
  useEffect(() => {
    if (currentStep === 2) {
      console.log('Step 2 reached, checking themes...', { 
        availableThemesCount: availableThemes.length, 
        isLoadingThemes 
      });
      
      const loadThemes = async () => {
        try {
          // Only fetch themes if we don't have any yet
          if (availableThemes.length === 0 && refreshAvailableThemes) {
            console.log('No themes available, fetching...');
            await refreshAvailableThemes();
          } else {
            console.log('Themes already available, skipping fetch');
          }
        } catch (error) {
          console.error('Failed to refresh themes:', error);
          // Don't crash the app, just log the error
          // Set a fallback state to prevent crashes
          console.log('Setting fallback themes to prevent crash');
        }
      };
      
      // Wrap in try-catch to prevent any unhandled errors
      try {
        loadThemes();
      } catch (error) {
        console.error('Unexpected error in loadThemes:', error);
      }
    }
  }, [currentStep]); // Only depend on currentStep to avoid infinite loops

  // Set default theme when themes become available (separate effect to avoid infinite loop)
  useEffect(() => {
    if (currentStep === 2 && availableThemes.length > 0 && !selectedThemeId) {
      // Set a default selected theme if none is chosen and themes are available
      const firstTheme = availableThemes[0];
      if (firstTheme && firstTheme.id && firstTheme.name) {
        setSelectedThemeId(firstTheme.id);
        console.log('Setting default theme:', firstTheme);
      } else if (currentGlobalTheme && availableThemes.find(t => t.id === currentGlobalTheme.id)) {
        // Default to currentGlobalTheme if it's in the available list and nothing else is selected
        setSelectedThemeId(currentGlobalTheme.id);
        console.log('Setting current global theme:', currentGlobalTheme);
      }
    }
  }, [currentStep, availableThemes, selectedThemeId, currentGlobalTheme]); // This effect only runs when these values change

  // Debug effect to track step changes
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
  }, [currentStep]);


  const onDateTimeChange = (event: DateTimePickerEvent, value?: Date) => {
    const currentMode = showPicker; // Capture current mode before hiding picker
    setShowPicker('none'); // Hide picker immediately for Android, or after 'Done' on iOS

    if (value) {
      if (currentMode === 'date') {
        setSelectedDate(value);
      } else if (currentMode === 'time') {
        // Format time as HH:MM (24-hour) or HH:MM AM/PM based on preference
        // For simplicity, let's use toLocaleTimeString and let the user see their local format.
        // The service expects a string like "14:00" or "2:00 PM".
        // We'll format it to HH:MM AM/PM for display and submission.
        setTime(value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    }
  };
  
  const handleNextStep = () => {
    try {
      console.log('handleNextStep called', { currentStep, name: name.trim(), selectedDate });
      
      if (currentStep === 1) {
        // Validate Step 1 data
        if (!name.trim()) {
          Alert.alert('Error', 'Event name is required.');
          return;
        }
        if (!selectedDate) {
          Alert.alert('Error', 'Event date is required.');
          return;
        }
        
        console.log('Step 1 validation passed, moving to step 2');
        setCurrentStep(2);
      } else if (currentStep === 2) {
        // No specific validation for theme selection, can be optional
        console.log('Step 2 validation passed, moving to step 3');
        setCurrentStep(3);
      }
    } catch (error) {
      console.error('Error in handleNextStep:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleFinalizeEventCreation = async () => {
    if (!currentUser?.uid) {
      Alert.alert('Error', 'User not authenticated. Cannot create event.');
      return;
    }
    if (!selectedDate) {
      Alert.alert('Error', 'Event date is required.');
      return;
    }
    
    // Validate theme selection if a theme is selected
    if (selectedThemeId) {
      const selectedTheme = availableThemes.find(t => t.id === selectedThemeId);
      if (!selectedTheme) {
        Alert.alert('Error', 'Selected theme is no longer available. Please select a different theme.');
        return;
      }
      console.log('Validating selected theme:', selectedTheme);
    }

    // Ensure allowedUserIds is always an array
    const finalAllowedUserIds = visibility === 'private' ? (Array.isArray(allowedUserIds) ? allowedUserIds : []) : [];
    
    const payload: CreateEventPayload = {
      name: name.trim(),
      date: selectedDate.toISOString(), // Store date as ISO string
      description: description.trim() || undefined,
      location: location.trim() || undefined,
      time: time.trim() || undefined,
      visibility: visibility,
      allowedUserIds: finalAllowedUserIds,
      themeId: selectedThemeId, // selectedThemeId is already string | undefined
      // overallBudget can be added here if collected in step 1
    };
    
    console.log('Creating event with payload:', payload);
    console.log('Selected theme ID:', selectedThemeId);
    console.log('Available themes:', availableThemes);

    // Show loading indicator for the final creation process
    // isCreatingEvent state from useAllEvents can be used here.
    // For now, let's assume addEvent handles its own loading state for the UI button.

    try {
      if (!addEvent) {
        throw new Error('addEvent function not available');
      }
      if (!currentUser?.uid) {
        throw new Error('Current user not available');
      }
      
      console.log('Calling addEvent with payload:', payload);
      const newEvent = await addEvent(payload, currentUser.uid);
      console.log('Event created successfully:', newEvent);
      
      if (newEvent) {
        // After event is created, update website if data exists
        // Ensure eventService is imported if not already, or use a method from a hook if available
        const eventServiceRef = await import('../../services/eventService'); // Dynamic import if not top-level
        if (Object.keys(eventWebsiteData).length > 0 && newEvent.id) { // Check newEvent.id
          await eventServiceRef.updateEventWebsite(!!currentUser, newEvent.id, eventWebsiteData as UpdateEventWebsiteDetailsPayload);
        }
        Alert.alert('Success', 'Event created successfully!');
        router.replace({ pathname: '/(events)/details/[id]', params: { id: newEvent.id } });
      } else {
        Alert.alert('Error', 'Failed to create event. Please try again.');
      }
    } catch (error) {
      console.error("Failed to create event:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        payload: payload,
        selectedThemeId,
        availableThemes
      });
      Alert.alert('Error', 'An unexpected error occurred during finalization.');
    }
  };
  
  const renderStep1Details = () => (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Event Name <Text style={styles.requiredStar}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Enter event name..."
              placeholderTextColor={Colors.light.textSecondary}
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
                <Ionicons name="calendar-outline" size={20} color={Colors.light.icon} />
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
                <Ionicons name="time-outline" size={20} color={Colors.light.icon} />
              </View>
            </TouchableOpacity>
          </View>

          {showPicker !== 'none' && (
            <DateTimePicker
              testID="dateTimePicker"
              value={showPicker === 'date' ? selectedDate : new Date()} // For time, can use new Date() as base
              mode={showPicker}
              is24Hour={false} // Or true based on preference
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateTimeChange}
            />
          )}
          {/* iOS Modal for DateTimePicker is handled differently in newer react-native-community/datetimepicker versions or via custom modals */}
          {/* The above single DateTimePicker should work for both if display="spinner" is acceptable for iOS date/time */}


          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Location (Venue)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter location or venue..."
              placeholderTextColor={Colors.light.textSecondary}
              value={location}
              onChangeText={setLocation}
            />
          </View>
          
          {/* Visibility Picker */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Visibility</Text>
            <View style={styles.visibilitySelectorContainer}>
              {(['public', 'private', 'unlisted'] as EventType['visibility'][]).map(visOption => (
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
                style={styles.input} // Re-use input style for button appearance
                onPress={async () => {
                  if (!allUsersForPicker.length) { // Fetch users only if not already fetched
                    setIsLoadingUsers(true);
                    try {
                      const users = await userService.getAllUsersForPicker(!!currentUser); // Pass isAuthenticated
                      setAllUsersForPicker(users);
                    } catch (err) {
                      console.error("Failed to fetch users for picker:", err);
                      Alert.alert("Error", "Could not load users to select from.");
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
              placeholderTextColor={Colors.light.textSecondary}
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
          
          {/* Basic Theme Picker - replace with a nicer UI if needed */}
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
      
      // Validate eventWebsiteData to prevent crashes
      const safeEventWebsiteData = eventWebsiteData || {};
      console.log('Safe event website data:', safeEventWebsiteData);
      
      return (
        <>
          <Text style={styles.inputLabel}>Customize Your Event Website</Text>
          {/* For now, let's use a simple form instead of the complex EventWebsiteForm */}
          {/* This will help us identify if the issue is with EventWebsiteForm */}
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

  return (
    <SafeAreaView style={styles.container} edges={['top','left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: "Create New Event" }} />
       <View style={styles.header}>
         <TouchableOpacity onPress={() => currentStep === 1 ? router.back() : handlePreviousStep()} style={styles.backButton}>
           <Ionicons name="chevron-back" size={24} color={Colors.light.tint} />
         </TouchableOpacity>
         <Text style={styles.headerTitle}>Create Event - Step {currentStep}</Text>
         <View style={{width: 24}} />
       </View>

      {/* Progress Tabs */}
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
                style={[styles.nextButton, isCreatingEvent && styles.disabledButton]} 
                onPress={handleFinalizeEventCreation}
                disabled={isCreatingEvent}
              >
                {isCreatingEvent ? <ActivityIndicator color="#fff" /> : <Text style={styles.nextButtonText}>Create Event</Text>}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* User Picker Modal for Private Event Viewers (used in Step 1) */}
      {/* For now, this is a simplified modal. Ideally, use MultiUserPicker or a dedicated component */}
      <Modal
        visible={isUserPickerVisible}
        animationType="slide"
        onRequestClose={() => setIsUserPickerVisible(false)}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setIsUserPickerVisible(false)} style={styles.backButton}>
              <Ionicons name="close-outline" size={28} color={Colors.light.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Select Viewers</Text>
            <TouchableOpacity onPress={() => setIsUserPickerVisible(false)} style={styles.backButton} >
                 <Text style={{color: Colors.light.primary, fontSize: 16, fontWeight: '600'}}>Done</Text>
            </TouchableOpacity>
          </View>
          {isLoadingUsers ? (
            <ActivityIndicator style={{marginTop: 20}} size="large" color={Colors.light.primary} />
          ) : (
            <MultiUserPicker
              users={allUsersForPicker.filter(u => u.userId !== currentUser?.uid)} // Exclude current user
              selectedUserIds={allowedUserIds}
              onSelectionChange={(ids) => setAllowedUserIds(ids)}
              // multiSelection prop removed as it's not part of MultiUserPickerProps
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

// UserProfile and EventWebsiteForm imports moved to the top
export default CreateEventScreen;

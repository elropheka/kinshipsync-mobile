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
import EventWebsiteForm from '../../components/website/EventWebsiteForm'; // Moved EventWebsiteForm import higher


const CreateEventScreen = () => {
  const router = useRouter();
  const { addEvent, isLoading: isCreatingEvent } = useAllEvents();
  const { user: currentUser } = useAppAuth(); 

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
  const { 
    availableThemes, 
    isLoadingThemes, 
    refreshAvailableThemes, 
    theme: currentGlobalTheme // Can be used for a default if no theme is selected yet
  } = useTheme();
  const [selectedThemeId, setSelectedThemeId] = useState<string | undefined>(undefined); // Initialize as undefined

  // Step 3: Website
  const [eventWebsiteData, setEventWebsiteData] = useState<Partial<UpdateEventWebsiteDetailsPayload>>({});


  const [showPicker, setShowPicker] = useState<'date' | 'time' | 'none'>('none');

  // Fetch available themes when step 2 is shown
  useEffect(() => {
    if (currentStep === 2) {
      refreshAvailableThemes(); // This function is from useTheme and handles auth state internally
      // Set a default selected theme if none is chosen and themes are available
      if (!selectedThemeId && availableThemes.length > 0) {
        setSelectedThemeId(availableThemes[0].id); 
      } else if (!selectedThemeId && currentGlobalTheme && availableThemes.find(t => t.id === currentGlobalTheme.id)) {
        // Default to currentGlobalTheme if it's in the available list and nothing else is selected
        setSelectedThemeId(currentGlobalTheme.id);
      }
    }
  // Ensure all dependencies that could trigger a re-run and affect logic are included.
  }, [currentStep, refreshAvailableThemes, availableThemes, selectedThemeId, currentGlobalTheme]); // Removed currentUser from here as refreshAvailableThemes depends on isAuthenticated from useAuth which depends on user.


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
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // No specific validation for theme selection, can be optional
      setCurrentStep(3);
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
    if (!currentUser?.uid) {
      Alert.alert('Error', 'User not authenticated. Cannot create event.');
      return;
    }

    const payload: CreateEventPayload = {
      name: name.trim(),
      date: selectedDate.toISOString(), // Store date as ISO string
      description: description.trim() || undefined,
      location: location.trim() || undefined,
      time: time.trim() || undefined,
      visibility: visibility,
      allowedUserIds: visibility === 'private' ? allowedUserIds : [],
      themeId: selectedThemeId, // selectedThemeId is already string | undefined
      // overallBudget can be added here if collected in step 1
    };

    // Show loading indicator for the final creation process
    // isCreatingEvent state from useAllEvents can be used here.
    // For now, let's assume addEvent handles its own loading state for the UI button.

    try {
      const newEvent = await addEvent(payload, currentUser.uid);
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

  const renderStep2Themes = () => (
    <>
      <Text style={styles.inputLabel}>Select a Theme</Text>
      {isLoadingThemes && <ActivityIndicator />}
      {/* Basic Theme Picker - replace with a nicer UI if needed */}
      {availableThemes.map(theme => (
        <TouchableOpacity 
          key={theme.id} 
          style={[styles.themeItemButton, selectedThemeId === theme.id && styles.themeItemButtonSelected]}
          onPress={() => setSelectedThemeId(theme.id)}
        >
          <Text style={selectedThemeId === theme.id ? styles.themeItemTextSelected : styles.themeItemText}>
            {theme.name}
          </Text>
          {/* Optionally show theme.primaryColor swatch */}
        </TouchableOpacity>
      ))}
      {availableThemes.length === 0 && !isLoadingThemes && <Text>No themes available.</Text>}
    </>
  );

  const renderStep3Website = () => (
    <>
      <Text style={styles.inputLabel}>Customize Your Event Website</Text>
      {/* Embed EventWebsiteForm here, passing eventWebsiteData and a handler to update it */}
      <EventWebsiteForm 
        initialWebsiteData={eventWebsiteData}
        onSubmit={(data) => setEventWebsiteData(data)}
        onCancel={() => { /* This form is embedded, cancel might mean reset to default */ }} 
        // Hide header if embedded:
        // showHeader={false} 
      />
    </>
  );

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
          {currentStep === 1 && renderStep1Details()}
          {currentStep === 2 && renderStep2Themes()}
          {currentStep === 3 && renderStep3Website()}

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

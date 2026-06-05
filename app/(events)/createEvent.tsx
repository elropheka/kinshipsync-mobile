import React, { useState, useEffect, useMemo } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Platform, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as Clipboard from 'expo-clipboard';
import { createCreateEventStyles } from '@/styles/app/(events)/createEvent.styles';
import { useAppTheme } from '@/context/AppThemeContext';
import { useAllEvents } from '@/hooks/useEvents'; 
import { 
  CreateEventPayload, 
  Event as EventType, 
  UpdateEventWebsiteDetailsPayload 
} from '@/types/eventTypes';
import { UserProfile } from '@/types/userTypes'; 
import { useAppAuth } from '@/hooks/useAppAuth'; 
import { useTheme } from '@/context/ThemeContext'; 
import MultiUserPicker from '@/components/common/MultiUserPicker';
import * as userService from '@/services/userService';
import EventWebsiteForm from '@/components/website/EventWebsiteForm';
import { EventCoverImagePicker } from '@/components/events/EventCoverImagePicker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getEventWebsiteUrl } from '@/utils/eventWebsiteUtils';
import { useAlert } from '@/context/AlertContext';

const CreateEventScreen = () => {
  const { currentColors } = useAppTheme();
  const styles = createCreateEventStyles(currentColors);


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

  const { showSuccess, showError, showInfo } = useAlert();
  const [currentStep, setCurrentStep] = useState(1);


  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
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


  const [eventWebsiteData, setEventWebsiteData] = useState<Partial<UpdateEventWebsiteDetailsPayload>>({});
  const [hasWebsiteData, setHasWebsiteData] = useState(false);
  const [skipWebsite, setSkipWebsite] = useState(false);

  const [showPicker, setShowPicker] = useState<'date' | 'time' | 'none'>('none');


  useEffect(() => {
    if (currentStep === 2) {
      const loadThemes = async () => {
        try {
          if (availableThemes.length === 0 && refreshAvailableThemes) {
            await refreshAvailableThemes();
          }
        } catch (error) {
          console.error('Failed to refresh themes:', error);
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
      } else if (currentGlobalTheme && availableThemes.find(t => t.id === currentGlobalTheme.id)) {
        setSelectedThemeId(currentGlobalTheme.id);
      }
    }
  }, [currentStep, availableThemes, selectedThemeId, currentGlobalTheme]);


  const onDateTimeChange = (event: DateTimePickerEvent, value?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker('none');
    }
    
    if (value) {
      if (showPicker === 'date') {
        setSelectedDate(value);
      } else if (showPicker === 'time') {
        setSelectedTime(value);
      }
    }
  };

  const handlePickerDismiss = () => {
    setShowPicker('none');
  };
  
  const handleNextStep = () => {
    try {
      if (currentStep === 1) {
        if (!name.trim()) {
          showError('Error', 'Event name is required.');
          return;
        }
        if (!selectedDate) {
          showError('Error', 'Event date is required.');
          return;
        }
        setCurrentStep(2);
      } else if (currentStep === 2) {
        setCurrentStep(3);
      }
    } catch (error) {
      console.error('Error in handleNextStep:', error);
      showError('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const handleSkipWebsite = () => {
    setSkipWebsite(true);
    setCurrentStep(4); // Go to final step (create event)
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      if (currentStep === 4) {
        // If going back from create step, go to website step if we have website data, otherwise go to theme step
        if (hasWebsiteData && !skipWebsite) {
          setCurrentStep(3);
        } else {
          setCurrentStep(2);
        }
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };
  
  const handleFinalizeEventCreation = async () => {
    if (!currentUser?.uid) {
      showError('Error', 'User not authenticated. Cannot create event.');
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
    }


    const finalAllowedUserIds = visibility === 'private' ? (Array.isArray(allowedUserIds) ? allowedUserIds : []) : [];
    
    const payload: CreateEventPayload = {
      name: name.trim(),
      date: selectedDate.toISOString(),
      ...(description.trim() ? { description: description.trim() } : {}),
      ...(location.trim() ? { location: location.trim() } : {}),
      time: selectedTime ? selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
      visibility: visibility,
      allowedUserIds: finalAllowedUserIds,
      themeId: selectedThemeId,
      ...(coverImageUrl ? { coverImageUrl } : {}),
    };



    try {
      if (!addEvent) {
        throw new Error('addEvent function not available');
      }
      if (!currentUser?.uid) {
        throw new Error('Current user not available');
      }
      
      const newEvent = await addEvent(payload, currentUser.uid);
      
      if (newEvent) {
        const eventServiceRef = await import('../../services/eventService');
        let websiteUrl: string | null = null;
        let customUrlSlug: string | null = null;
        
        // Create website if we have website data and didn't skip it
        if (newEvent.id && hasWebsiteData && !skipWebsite) {
          const websitePayload: UpdateEventWebsiteDetailsPayload = {
            ...eventWebsiteData,
            title: eventWebsiteData.title || name || 'Untitled Event',
            websiteThemeId: eventWebsiteData.websiteThemeId || selectedThemeId,
            published: eventWebsiteData.published || false,
            sections: eventWebsiteData.sections || [],
          };
          
          try {
            // Generate a customUrlSlug if one wasn't provided
            if (!websitePayload.customUrlSlug && name) {
              const { generateSlug } = await import('../../utils/eventWebsiteUtils');
              websitePayload.customUrlSlug = generateSlug(name);
            }
            
            await eventServiceRef.updateEventWebsite(!!currentUser, newEvent.id, websitePayload);
            
            // Also update the event document's website field with customUrlSlug
            const { doc, updateDoc } = await import('@firebase/firestore');
            const { firestore } = await import('../../services/firebaseConfig');
            const eventDocRef = doc(firestore, 'events', newEvent.id);
            await updateDoc(eventDocRef, {
              website: {
                customUrlSlug: websitePayload.customUrlSlug,
                published: websitePayload.published || false,
              }
            });
            
            // Get the customUrlSlug from the payload (we just set it)
            customUrlSlug = websitePayload.customUrlSlug || null;
            
            // Generate the website URL if we have a slug
            if (customUrlSlug) {
              websiteUrl = getEventWebsiteUrl(customUrlSlug);
            }
          } catch (websiteError) {
            console.error('Error creating website:', websiteError);
            // Don't fail the entire event creation if website creation fails
          }
        }
        
        // Route to event details page immediately after successful creation
        router.replace({ pathname: '/(events)/details/[id]', params: { id: newEvent.id } });
        
        // Show success alert with website URL if available
        if (websiteUrl) {
          showSuccess(
            'Event Created Successfully!',
            `Your event website is ready!\n\nWebsite URL:\n${websiteUrl}`,
            {
              confirmText: 'OK',
            }
          );
          // Copy URL option - show info alert
          try {
            await Clipboard.setStringAsync(websiteUrl!);
            setTimeout(() => {
              showInfo('Copied!', 'Website URL copied to clipboard.');
            }, 500);
          } catch (copyError) {
            console.error('Error copying to clipboard:', copyError);
            setTimeout(() => {
              showError('Error', 'Could not copy URL to clipboard.');
            }, 500);
          }
        } else {
          showSuccess('Success', 'Event created successfully!');
        }
      } else {
        showError('Error', 'Failed to create event. Please try again.');
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
      showError('Error', 'An unexpected error occurred during finalization.');
    }
  };
  
  const renderStep1Details = () => (
    <>
      <EventCoverImagePicker
        coverImageUrl={coverImageUrl || undefined}
        onCoverImageUrlChange={setCoverImageUrl}
        organizerId={currentUser?.uid}
      />
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
                <Text style={selectedTime ? styles.datePickerTextSelected : styles.datePickerText}>
                  {selectedTime ? selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Select Time'}
                </Text>
                <Ionicons name="time-outline" size={20} color={currentColors.icon} />
              </View>
            </TouchableOpacity>
          </View>

          {showPicker !== 'none' && (
            <>
              {Platform.OS === 'android' && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={showPicker === 'date' ? selectedDate : (selectedTime || new Date())}
                  mode={showPicker}
                  is24Hour={false}
                  display="default"
                  onChange={onDateTimeChange}
                  style={{
                    backgroundColor: 'white'
                  }}
                  textColor="#000000"
                  themeVariant="light"
                />
              )}
              {Platform.OS === 'ios' && (
                <Modal
                  transparent={true}
                  animationType="slide"
                  visible={showPicker === 'date' || showPicker === 'time'}
                  onRequestClose={handlePickerDismiss}
                >
                  <View style={{ 
                    flex: 1, 
                    backgroundColor: 'rgba(0,0,0,0.5)', 
                    justifyContent: 'flex-end' 
                  }}>
                    <View style={{ 
                      backgroundColor: 'white', 
                      borderTopLeftRadius: 20, 
                      borderTopRightRadius: 20,
                      padding: 20,
                      minHeight: 300
                    }}>
                      <View style={{ 
                        flexDirection: 'row', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: 20
                      }}>
                        <TouchableOpacity onPress={handlePickerDismiss}>
                          <Text style={{ color: currentColors.primary, fontSize: 16 }}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                          Select {showPicker === 'date' ? 'Date' : 'Time'}
                        </Text>
                        <TouchableOpacity onPress={handlePickerDismiss}>
                          <Text style={{ color: currentColors.primary, fontSize: 16, fontWeight: 'bold' }}>Done</Text>
                        </TouchableOpacity>
                      </View>
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={showPicker === 'date' ? selectedDate : (selectedTime || new Date())}
                        mode={showPicker}
                        is24Hour={false}
                        display="spinner"
                        onChange={onDateTimeChange}
                        style={{ 
                          width: '100%',
                          backgroundColor: 'white'
                        }}
                        textColor="#000000"
                        themeVariant="light"
                      />
                    </View>
                  </View>
                </Modal>
              )}
            </>
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
      return (
        <>
          <Text style={styles.inputLabel}>Select a Theme</Text>
          {isLoadingThemes && <ActivityIndicator />}

          {Array.isArray(availableThemes) && availableThemes.length > 0 ? (
            availableThemes.map(theme => {
              if (!theme || !theme.id || !theme.name) {
                return null;
              }
              
              return (
                <TouchableOpacity 
                  key={theme.id} 
                  style={[styles.themeItemButton, selectedThemeId === theme.id && styles.themeItemButtonSelected]}
                  onPress={() => setSelectedThemeId(theme.id)}
                >
                  <Text style={selectedThemeId === theme.id ? styles.themeItemTextSelected : styles.themeItemText}>
                    {theme.name}
                  </Text>
                </TouchableOpacity>
              );
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

  const handleWebsiteFormSubmit = (websiteData: UpdateEventWebsiteDetailsPayload) => {
    setEventWebsiteData(websiteData);
    setHasWebsiteData(true);
    // After saving website, go to final step to create event
    setCurrentStep(4);
    showInfo('Website Saved', 'Website details have been saved. You can now create your event.');
  };

  const handleWebsiteFormCancel = () => {
    handlePreviousStep();
  };

  const renderStep3Website = () => {
    try {
      const safeEventWebsiteData = eventWebsiteData || {};
      
      // Use the selected theme as the website theme if available
      const initialWebsiteData = {
        ...safeEventWebsiteData,
        websiteThemeId: safeEventWebsiteData.websiteThemeId || selectedThemeId,
        title: safeEventWebsiteData.title || name || 'Untitled Event',
      };
      
      return (
        <View style={{ flex: 1 }}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <EventWebsiteForm
              initialWebsiteData={initialWebsiteData}
              onSubmit={handleWebsiteFormSubmit}
              onCancel={handleWebsiteFormCancel}
            />
          </GestureHandlerRootView>
        </View>
      );
    } catch (error) {
      console.error('Error rendering step 3 website:', error);
      
      return (
        <>
          <Text style={styles.inputLabel}>Customize Your Event Website</Text>
          <Text style={{ color: 'red', fontSize: 14, marginTop: 10 }}>Error loading website form. Please try again.</Text>
        </>
      );
    }
  };

  const renderStep4Create = () => {
    return (
      <ScrollView style={styles.scrollableContent}>
        <View style={styles.formContainer}>
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Ionicons name="checkmark-circle" size={64} color={currentColors.primary} style={{ marginBottom: 20 }} />
            <Text style={[styles.inputLabel, { fontSize: 20, marginBottom: 10 }]}>Ready to Create Event</Text>
            <Text style={{ color: currentColors.textSecondary, textAlign: 'center', marginBottom: 30 }}>
              {hasWebsiteData && !skipWebsite 
                ? 'Your event details and website have been configured. Click the button below to create your event.'
                : 'Your event details have been configured. Click the button below to create your event.'}
            </Text>
            
            <TouchableOpacity 
              style={[styles.nextButton, isCreatingEvent && styles.disabledButton]} 
              onPress={handleFinalizeEventCreation}
              disabled={isCreatingEvent}
            >
              {isCreatingEvent ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.nextButtonText}>Create Event</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top','left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: "Create New Event" }} />
       <View style={styles.header}>
         <TouchableOpacity onPress={() => currentStep === 1 ? router.back() : handlePreviousStep()} style={styles.backButton}>
           <Ionicons name="chevron-back" size={24} color={currentColors.tint} />
         </TouchableOpacity>
         <Text style={styles.headerTitle}>
           {currentStep === 4 ? 'Create Event' : `Create Event - Step ${currentStep}`}
         </Text>
         <View style={{width: 24}} />
       </View>


      <View style={styles.tabContainer}>
        <View style={[styles.tabItem, currentStep === 1 && styles.activeTab]}>
          <Text style={[styles.tabText, currentStep === 1 && styles.activeTabText]}>Details</Text>
        </View>
        <View style={[styles.tabItem, currentStep === 2 && styles.activeTab]}>
          <Text style={[styles.tabText, currentStep === 2 && styles.activeTabText]}>Theme</Text>
        </View>
        <View style={[styles.tabItem, (currentStep === 3 || currentStep === 4) && styles.activeTab]}>
          <Text style={[styles.tabText, (currentStep === 3 || currentStep === 4) && styles.activeTabText]}>
            {currentStep === 4 ? 'Create' : 'Website'}
          </Text>
        </View>
      </View>

      {currentStep === 3 ? (
        renderStep3Website()
      ) : currentStep === 4 ? (
        renderStep4Create()
      ) : (
        <ScrollView style={styles.scrollableContent}>
          <View style={styles.formContainer}>
            {(() => {
              try {
                if (currentStep === 1) {
                  return renderStep1Details();
                } else if (currentStep === 2) {
                  return renderStep2Themes();
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
              {currentStep === 2 ? (
                <>
                  <TouchableOpacity 
                    style={[styles.nextButton, { backgroundColor: currentColors.textSecondary, marginRight: 10 }]} 
                    onPress={handleSkipWebsite}
                  >
                    <Text style={styles.nextButtonText}>Skip Website</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
                    <Text style={styles.nextButtonText}>Add Website</Text>
                  </TouchableOpacity>
                </>
              ) : currentStep === 1 ? (
                <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
                  <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </ScrollView>
      )}


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


export default CreateEventScreen;

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router'; 
import { createRsvpsStyles } from '@/styles/app/(events)/rsvps.styles';
import { useAppTheme } from '@/context/AppThemeContext';
import { useAppAuth } from '@/hooks/useAppAuth';
import { useAlert } from '@/context/AlertContext';
import { listenToGuestsWithRsvp, updateGuestRsvp, getEventById, sendRsvpReminderToGuest, addGuestToEvent } from '@/services/eventService';
import { getUserProfileByEmail } from '@/services/userService';
import { createDirectConversation, sendMessage } from '@/services/chatService';
import { Guest as GuestType, Event as EventType, UpdateGuestPayload, UpdateRSVPPayload, CreateGuestPayload } from '@/types/eventTypes';
import RsvpPreferenceForm from '@/components/events/RsvpPreferenceForm';
import { HeaderButtonItems } from '@/components/common/Navigation/HeaderButtonItems';
import InviteGuestModal from '@/components/events/InviteGuestModal';

const GUEST_STATUS_OPTIONS = ['All', 'Invited', 'accepted', 'declined', 'pending'] as const;
type GuestStatusFilterType = typeof GUEST_STATUS_OPTIONS[number];

const RsvpListScreen = () => {
  const { currentColors } = useAppTheme();
  const styles = createRsvpsStyles(currentColors);


  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  const { user } = useAppAuth();
  const isAuthenticated = !!user;
  const { showError, showSuccess } = useAlert();

  const [fetchedGuests, setFetchedGuests] = useState<GuestType[]>([]);
  const [eventDetails, setEventDetails] = useState<EventType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<GuestStatusFilterType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isPreferenceModalVisible, setIsPreferenceModalVisible] = useState(false);
  const [editingGuest, setEditingGuest] = useState<GuestType | null>(null);
  const [remindingGuestId, setRemindingGuestId] = useState<string | null>(null);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false); 

  useEffect(() => {
    if (!eventId) {
      setError(new Error("Event ID is missing. Cannot load RSVPs."));
      setIsLoading(false);
      return;
    }
    if (!isAuthenticated) {
      setError(new Error("User not authenticated. Cannot load RSVPs."));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    getEventById(isAuthenticated, eventId)
      .then(details => setEventDetails(details))
      .catch(err => console.error("Error fetching event details for RSVP screen:", err));

    const unsubscribe = listenToGuestsWithRsvp(
      isAuthenticated,
      eventId,
      (guestsFromDb) => {
        setFetchedGuests(guestsFromDb);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, [eventId, isAuthenticated, user]);

  const displayedGuests = useMemo(() => {
    let guestsToDisplay = [...fetchedGuests];
    if (selectedStatusFilter !== 'All') {
      guestsToDisplay = guestsToDisplay.filter(guest => guest.status === selectedStatusFilter);
    }
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      guestsToDisplay = guestsToDisplay.filter(
        guest =>
          guest.name.toLowerCase().includes(lowercasedQuery) ||
          (guest.email && guest.email.toLowerCase().includes(lowercasedQuery))
      );
    }
    return guestsToDisplay;
  }, [fetchedGuests, selectedStatusFilter, searchQuery]);

  const handleOpenPreferenceModal = (guest: GuestType) => {
    setEditingGuest(guest);
    setIsPreferenceModalVisible(true);
  };

  const handleClosePreferenceModal = () => {
    setEditingGuest(null);
    setIsPreferenceModalVisible(false);
  };

  const handleSubmitPreferenceForm = async (formDataFromModal: any) => {
    if (!editingGuest || !eventId || !isAuthenticated) {
      showError("Error", "Cannot update RSVP. Missing information.");
      return;
    }
    try {
      const { status: formStatus, preferences } = formDataFromModal;
      let serviceStatus: GuestType['status'];

      if (formStatus === 'Attending') serviceStatus = 'accepted';
      else if (formStatus === 'Not Attending') serviceStatus = 'declined';
      else serviceStatus = 'pending';

      const payload: Partial<UpdateGuestPayload & UpdateRSVPPayload> = {
        status: serviceStatus,
        notes: preferences?.otherNotes,
        plusOnes: (preferences?.plusOne && serviceStatus === 'accepted') ? (preferences.plusOneName ? 1 : 1) : 0,
      };
      
      await updateGuestRsvp(isAuthenticated, eventId, editingGuest.id, payload);
      showSuccess("RSVP Updated", `${editingGuest.name}'s RSVP has been updated.`);
      handleClosePreferenceModal();
    } catch (e: any) {
      console.error("Error updating RSVP:", e);
      showError("Error", `Failed to update RSVP: ${e.message || 'Unknown error'}`);
    }
  };

  const handleSendReminder = async (guest: GuestType) => {
    if (!eventId || !isAuthenticated) {
      showError("Error", "Cannot send reminder. Missing event or authentication information.");
      return;
    }
    setRemindingGuestId(guest.id);
    try {
      await sendRsvpReminderToGuest(isAuthenticated, eventId, guest.id);
      showSuccess("Reminder Sent", `An RSVP reminder has been sent to ${guest.name}.`);
    } catch (e: any) {
      console.error("Error sending reminder:", e);
      showError("Error", `Failed to send reminder: ${e.message || 'Unknown error'}`);
    } finally {
      setRemindingGuestId(null);
    }
  };

  const handleInviteGuestSubmit = async (guestData: CreateGuestPayload) => {
    if (!eventId || !isAuthenticated) {
      showError("Error", "Cannot invite guest. Event ID or authentication missing.");
      throw new Error("Event ID or auth missing");
    }
    try {
      const invitedGuest = await addGuestToEvent(isAuthenticated, eventId, guestData);
      showSuccess("Success", `${invitedGuest.name} has been invited.`);
      setIsInviteModalVisible(false);

      if (guestData.email && user?.uid && eventId) {
        try {
          const invitedAppUser = await getUserProfileByEmail(guestData.email);
          if (invitedAppUser && invitedAppUser.userId !== user.uid) {
            console.log('Guest would be linked to user:', invitedAppUser.userId);

            const conversation = await createDirectConversation(isAuthenticated, user.uid, {
              recipientId: invitedAppUser.userId,
            });

            if (conversation) {
              const eventName = eventDetails?.name || 'an event';
              const invitationContent = `You've been invited to ${eventName}.`;
              await sendMessage(isAuthenticated, {
                conversationId: conversation.id,
                content: invitationContent,
                contentType: 'eventInvitation',
                eventId: eventId,
                guestId: invitedGuest.id,
                eventName: eventName,
                rsvpStatus: 'pending',
              }, user.uid);
              console.log(`Event invitation message sent to ${invitedAppUser.displayName || invitedAppUser.email}`);
            }
          } else if (invitedAppUser && invitedAppUser.userId === user.uid) {
            console.log("Invited guest is the current user, no DM sent.");
          } else {
            console.log(`Guest with email ${guestData.email} is not an existing app user. No DM invitation sent.`);
          }
        } catch (dmError: any) {
          console.error("Failed to send direct message or find user:", dmError.message);
        }
      }
    } catch (e: any) {
      showError("Error", `Failed to invite guest: ${e.message}`);
      throw e;
    }
  };

  const renderRsvpItem = ({ item: guest }: { item: GuestType }) => (
    <TouchableOpacity style={styles.rsvpItem} onPress={() => handleOpenPreferenceModal(guest)}>
      <View style={styles.rsvpInfo}>
        <Text style={styles.guestName}>{guest.name}</Text>
        {guest.email && <Text style={styles.eventName}>{guest.email}</Text>} 
        {guest.notes && <Text style={styles.preferenceText}>Notes: {guest.notes}</Text>}
        {guest.plusOnes !== undefined && guest.plusOnes > 0 && (
            <Text style={styles.preferenceText}>+ {guest.plusOnes} guest(s)</Text>
        )}
        {(guest.status === 'Invited' || guest.status === 'pending') && (
          <TouchableOpacity 
            style={styles.reminderButton}
            disabled={remindingGuestId === guest.id}
            onPress={(e) => {
              e.stopPropagation();
              handleSendReminder(guest);
            }}
          >
            {remindingGuestId === guest.id ? (
              <ActivityIndicator size="small" color="#fff" style={{ marginRight: 5 }}/>
            ) : (
              <Icon name="notifications-active" size={18} color="#fff" />
            )}
            <Text style={styles.reminderButtonText}>
              {remindingGuestId === guest.id ? 'Sending...' : 'Send Reminder'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.statusContainer}>
        <View style={[
          styles.statusDot, 
          { 
            backgroundColor: 
              guest.status === 'accepted' ? currentColors.success :
              guest.status === 'declined' ? currentColors.error :
              guest.status === 'Invited' ? currentColors.info :
              guest.status === 'pending' ? currentColors.warning :
              currentColors.textSecondary 
          }
        ]} />
        <Text style={[
          styles.statusText,
          { 
            color: 
              guest.status === 'accepted' ? currentColors.success :
              guest.status === 'declined' ? currentColors.error :
              guest.status === 'Invited' ? currentColors.info :
              guest.status === 'pending' ? currentColors.warning :
              currentColors.textSecondary
          }
        ]}>
          {guest.status}
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  if (isLoading && fetchedGuests.length === 0) {
    return <SafeAreaView style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]} edges={['left', 'right', 'bottom']}><ActivityIndicator size="large" /><Text>Loading RSVPs...</Text></SafeAreaView>;
  }

  if (error) {
    return <SafeAreaView style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]} edges={['left', 'right', 'bottom']}><Text style={{color: 'red'}}>Error: {error.message}</Text></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen
        options={{
          title: eventDetails?.name || (eventId ? `Event ${eventId.substring(0,6)}...` : 'RSVPs'),
          ...HeaderButtonItems.headerRightIconOptions({
            label: 'Invite guest',
            sfSymbol: 'person.badge.plus',
            ionicon: 'person-add-outline',
            onPress: () => setIsInviteModalVisible(true),
            tintColor: currentColors.accentContrastText,
          }),
        }}
      />
   
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or email"
          placeholderTextColor="gray"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filtersContainer}>
         <FlatList
          horizontal
          data={GUEST_STATUS_OPTIONS}
          keyExtractor={(item) => item}
          renderItem={({ item: filterName }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedStatusFilter === filterName && styles.selectedFilter,
              ]}
              onPress={() => setSelectedStatusFilter(filterName)}
            >
              <Text style={[
                styles.filterText,
                selectedStatusFilter === filterName && { color: '#FFFFFF' }
              ]}>{filterName}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 10 }}
        />
      </View>

      <View style={styles.itemCountContainer}>
        <Text style={styles.itemCount}>{displayedGuests.length} Guest RSVPs</Text>
      </View>

      {displayedGuests.length === 0 && !isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 16, color: currentColors.textSecondary}}>
                {searchQuery || selectedStatusFilter !== 'All' ? 'No guests match your criteria.' : 'No RSVPs found for this event.'}
            </Text>
        </View>
      ) : (
        <FlatList
          data={displayedGuests}
          renderItem={renderRsvpItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      {isPreferenceModalVisible && editingGuest && (
        <RsvpPreferenceForm
          visible={isPreferenceModalVisible}
          onClose={handleClosePreferenceModal}
          onSubmit={handleSubmitPreferenceForm}
          initialRsvpData={editingGuest ? {
            id: editingGuest.id,
            guestName: editingGuest.name,
            eventName: eventDetails?.name || `Event ID: ${eventId}`,
            status: 
              editingGuest.status === 'accepted' ? 'Attending' :
              editingGuest.status === 'declined' ? 'Not Attending' :
              'Pending',
            preferences: {
              otherNotes: editingGuest.notes,
              plusOne: editingGuest.plusOnes !== undefined && editingGuest.plusOnes > 0,
              plusOneName: '', 
              dietaryRestrictions: [],
            }
          } : null}
        />
      )}
      <InviteGuestModal 
        visible={isInviteModalVisible}
        onClose={() => setIsInviteModalVisible(false)}
        onSubmit={handleInviteGuestSubmit}
        currentEventName={eventDetails?.name}
      />
    </SafeAreaView>
  );
};

export default RsvpListScreen;

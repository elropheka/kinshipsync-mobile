import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router'; // Stack import moved here
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createIndexStyles } from '../../../styles/app/(events)/schedule/index.styles';
import { useAppTheme } from '@/context/AppThemeContext';
import ScheduleItemForm from '@/components/events/ScheduleItemForm';
import { HeaderButtonItems } from '@/components/common/Navigation/HeaderButtonItems'; 
import { useAppAuth } from '../../../hooks/useAppAuth';
import { useAlert } from '@/context/AlertContext';
import { 
    listenToSchedule, 
    addScheduleItem, 
    updateScheduleItem, 
    deleteScheduleItem,
    getEventById
} from '../../../services/eventService';
import { 
    ScheduleItem as ScheduleItemType, 
    CreateScheduleItemPayload, 
    UpdateScheduleItemPayload,
    Event as EventType 
} from '../../../types/eventTypes';
import { useErrorAlert } from '@/hooks/useErrorAlert';
import { getErrorMessage } from '@/utils/errorUtils';
import { LoadingScreen } from '@/components/common/LoadingScreen';


const EventScheduleScreen = () => {
  const { currentColors } = useAppTheme();
  const styles = createIndexStyles(currentColors);


  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  const { user } = useAppAuth();
  const isAuthenticated = !!user;
  const { showError, showConfirm } = useAlert();

  const [scheduleItems, setScheduleItems] = useState<ScheduleItemType[]>([]);
  const [eventDetails, setEventDetails] = useState<EventType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [metadataError, setMetadataError] = useState<Error | null>(null);

  useErrorAlert(error);
  useErrorAlert(metadataError, { title: 'Could not load event details' });
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItemType | null>(null);
  
  const [isPlannerMode] = useState(true);

  const parseTimeStringToDate = (timeString: string): Date => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const formatDateToTimeString = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    if (!eventId) {
      setError(new Error("Event ID is missing."));
      setIsLoading(false);
      return;
    }
    if (!isAuthenticated) {
      setError(new Error("User not authenticated."));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    getEventById(isAuthenticated, eventId)
        .then(details => setEventDetails(details))
        .catch(err => {
          console.error("Error fetching event details for schedule:", err);
          setMetadataError(err instanceof Error ? err : new Error(getErrorMessage(err)));
        });

    const unsubscribe = listenToSchedule(
      isAuthenticated,
      eventId,
      (itemsFromDb) => {
        setScheduleItems(itemsFromDb.sort((a, b) => a.startTime.localeCompare(b.startTime)));
        setIsLoading(false);
        setError(null);
      },
      (listenerError) => {
        setError(listenerError);
        setIsLoading(false);
      },
    );
    return () => unsubscribe();
  }, [eventId, isAuthenticated, user]);


  const formatTime = (timeString: string) => {
    if (!timeString || !timeString.includes(':')) return 'N/A';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setIsModalVisible(true);
  };

  const handleEditItem = (item: ScheduleItemType) => {
    setEditingItem(item);
    setIsModalVisible(true);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!eventId || !isAuthenticated) {
        showError("Error", "Cannot delete item. Missing event ID or authentication.");
        return;
    }
    showConfirm(
      'warning',
      'Delete Item',
      'Are you sure you want to delete this schedule item?',
      async () => {
        try {
          await deleteScheduleItem(isAuthenticated, eventId, itemId);
        } catch (e: any) {
          showError("Error", `Failed to delete item: ${e.message}`);
        }
      },
      {
        confirmText: 'Delete',
        cancelText: 'Cancel',
      }
    );
  };

  const handleSubmitForm = async (
    formDataFromForm: { 
      title: string; 
      startTime: Date; 
      endTime: Date; 
      location?: string; 
      description?: string; 
      responsiblePerson?: string; 
      id?: string 
    }
  ) => {
    if (!eventId || !isAuthenticated) {
        showError("Error", "Cannot save item. Missing event ID or authentication.");
        return;
    }

    const servicePayload: CreateScheduleItemPayload | UpdateScheduleItemPayload = {
      title: formDataFromForm.title,
      startTime: formatDateToTimeString(formDataFromForm.startTime),
      endTime: formDataFromForm.endTime ? formatDateToTimeString(formDataFromForm.endTime) : undefined,
      location: formDataFromForm.location,
      description: formDataFromForm.description,
    };

    try {
      if (editingItem?.id) {
        await updateScheduleItem(isAuthenticated, eventId, editingItem.id, servicePayload as UpdateScheduleItemPayload);
      } else {
        await addScheduleItem(isAuthenticated, eventId, servicePayload as CreateScheduleItemPayload);
      }
      setIsModalVisible(false);
      setEditingItem(null);
    } catch (e: any) {
      showError("Error", `Failed to save schedule item: ${e.message}`);
    }
  };
  
  const renderItem = ({ item }: { item: ScheduleItemType }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemTiming}>
        <Text style={styles.itemTimeText}>{formatTime(item.startTime)}</Text>
        {item.endTime && <Text style={styles.itemTimeTextSmall}>to</Text>}
        {item.endTime && <Text style={styles.itemTimeText}>{formatTime(item.endTime)}</Text>}
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        {item.location && <Text style={styles.itemSubtitle}>Location: {item.location}</Text>}
        {item.description && <Text style={styles.itemSubtitle}>Details: {item.description}</Text>}
      </View>
      {isPlannerMode && (
        <View style={styles.itemActions}>
          <TouchableOpacity onPress={() => handleEditItem(item)} style={styles.actionButton}>
            <Icon name="edit" size={22} color={currentColors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteItem(item.id)} style={styles.actionButton}>
            <Icon name="delete" size={22} color={currentColors.error} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (isLoading && scheduleItems.length === 0) {
    return <LoadingScreen />;
  }

  if (error) {
    return <SafeAreaView style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]} edges={['left', 'right', 'bottom']}><Text style={{color: 'red'}}>Error: {error.message}</Text></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen
        options={{
          title: `Schedule: ${eventDetails?.name || (eventId ? `Event ${eventId.substring(0,6)}...` : 'Details')}`,
          ...(isPlannerMode
            ? HeaderButtonItems.headerRightIconOptions({
                label: 'Add item',
                sfSymbol: 'plus',
                ionicon: 'add',
                onPress: handleAddItem,
                tintColor: currentColors.accentContrastText,
              })
            : {}),
        }}
      />
      {/* Custom header View removed */}

      {scheduleItems.length === 0 && !isLoading ? (
         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 16, color: currentColors.textSecondary}}>No schedule items yet.</Text>
         </View>
      ) : (
        <FlatList
            data={scheduleItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContentContainer}
            ListEmptyComponent={<Text style={styles.emptyText}>No schedule items yet. Add some!</Text>}
        />
      )}

      {isModalVisible && (
        <ScheduleItemForm
          visible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            setEditingItem(null);
          }}
          onSubmit={handleSubmitForm}
          initialData={editingItem ? {
            ...editingItem,
            id: editingItem.id,
            startTime: parseTimeStringToDate(editingItem.startTime),
            endTime: editingItem.endTime ? parseTimeStringToDate(editingItem.endTime) : new Date(parseTimeStringToDate(editingItem.startTime).getTime() + 60 * 60 * 1000),
          } : null}
        />
      )}
    </SafeAreaView>
  );
};

export default EventScheduleScreen;

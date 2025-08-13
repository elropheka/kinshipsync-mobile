import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  ScrollView,
  FlatList, // Added FlatList
  ActivityIndicator, // Added for loading state
  Alert, // Added for error/success messages
  Modal, // Added for custom picker
  TouchableWithoutFeedback, // To close modal
  StatusBar
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // IMPORT Picker from new package
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // For icons
import { styles } from '../../styles/app/(events)/createNewTeam.styles'; // Use styles directly
import { Colors } from '../../constants/Colors'; // Import Colors
import { Stack, useRouter } from 'expo-router';
import { TeamType } from '../../types/teamTypes'; // Import TeamType
import { UserProfile } from '../../types/userTypes';
import { BackendUser } from '../../types/auth'; // Import BackendUser
import MultiUserPicker from '../../components/common/MultiUserPicker'; // Import MultiUserPicker
import { createTeam } from '../../services/teamService'; // Import createTeam service
import { getAllUsersForPicker } from '../../services/userService'; // Import userService function
import { AuthContext } from '../../context/AuthContext'; // To get current user ID

// Available icons for team creation (subset of Ionicons.glyphMap keys)
const availableIcons: (keyof typeof Ionicons.glyphMap)[] = [
  'people-outline', 'people-circle-outline', 'school-outline', 'book-outline', 
  'briefcase-outline', 'game-controller-outline', 'musical-notes-outline', 'color-palette-outline'
];

const CreateNewTeamScreen: React.FC = () => {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  // Ensure currentUser is correctly typed or handled if undefined
  const currentUser = authContext?.user as (BackendUser & { uid: string }) | undefined;

  const [teamName, setTeamName] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [teamType, setTeamType] = useState<TeamType>(TeamType.OTHER);
  const [iconName, setIconName] = useState<keyof typeof Ionicons.glyphMap>(availableIcons[0]);
  const [isTeamTypePickerVisible, setIsTeamTypePickerVisible] = useState(false);
  const [isIconPickerVisible, setIsIconPickerVisible] = useState(false);

  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define form sections for FlatList
  const formSections = [
    { id: 'teamNameInput', type: 'teamNameInput' },
    { id: 'teamTypePicker', type: 'teamTypePicker' },
    { id: 'iconPicker', type: 'iconPicker' },
    { id: 'memberPicker', type: 'memberPicker' },
    { id: 'submitButton', type: 'submitButton' },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser) {
        setError("Authentication required to fetch users.");
        return;
      }
      setIsLoadingUsers(true);
      try {
        // Assuming isAuthenticated is handled by checking currentUser
        const users = await getAllUsersForPicker(!!currentUser, 50); // Fetch up to 50 users
        // Ensure currentUser.uid is available before filtering
        setAllUsers(currentUser ? users.filter(u => u.userId !== currentUser.uid) : users);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load users. Please try again.");
      } finally {
        setIsLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [currentUser]);

  const handleCreateTeam = async () => {
    if (teamName.trim() === '') {
      Alert.alert('Validation Error', 'Please enter a team name.');
      return;
    }
    if (!currentUser || !currentUser.uid) { // Check currentUser and currentUser.uid
      Alert.alert('Error', 'You must be logged in to create a team.');
      return;
    }

    setIsCreatingTeam(true);
    setError(null);

    try {
      const payload = {
        name: teamName.trim(),
        memberIds: [currentUser.uid, ...selectedMemberIds], // Creator is always a member
        type: teamType,
        iconName: iconName,
        createdBy: currentUser.uid,
      };
      const newTeam = await createTeam(payload);
      Alert.alert('Success', `Team "${newTeam.name}" created successfully!`);
      setTeamName('');
      setSelectedMemberIds([]);
      setTeamType(TeamType.OTHER);
      setIconName(availableIcons[0]);
      router.back(); // Go back to the previous screen
    } catch (err) {
      console.error('Failed to create team:', err);
      setError('Failed to create team. Please try again.');
      Alert.alert('Error', 'Failed to create team. Please try again.');
    } finally {
      setIsCreatingTeam(false);
    }
  };

  const renderFormItem = ({ item }: { item: { id: string; type: string } }) => {
    switch (item.type) {
      case 'teamNameInput':
        return (
          <TextInput
            style={styles.input}
            placeholder="Team Name"
            value={teamName}
            onChangeText={setTeamName}
          />
        );
      case 'teamTypePicker':
        return (
          <>
            <Text style={styles.sectionTitle}>Team Type</Text>
            <TouchableOpacity onPress={() => setIsTeamTypePickerVisible(true)} style={styles.pickerInputContainer}>
              <Text style={styles.pickerInputText}>{teamType.charAt(0).toUpperCase() + teamType.slice(1)}</Text>
              <Ionicons name="chevron-down" size={20} color={Colors.light.icon} style={styles.pickerInputIcon} />
            </TouchableOpacity>
          </>
        );
      case 'iconPicker':
        return (
          <>
            <Text style={styles.sectionTitle}>Team Icon</Text>
            <TouchableOpacity onPress={() => setIsIconPickerVisible(true)} style={styles.iconPickerContainer}>
              <Ionicons name={iconName} size={24} color={Colors.light.icon} style={styles.selectedIconPreview} />
              <Text style={styles.pickerInputText}>{iconName.replace('-outline', '').replace('-', ' ')}</Text>
              <Ionicons name="chevron-down" size={20} color={Colors.light.icon} style={styles.pickerInputIcon} />
            </TouchableOpacity>
          </>
        );
      case 'memberPicker':
        return (
          <>
            <Text style={styles.sectionTitle}>Add Members</Text>
            {isLoadingUsers ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : error && !allUsers.length ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <MultiUserPicker
                users={allUsers}
                selectedUserIds={selectedMemberIds}
                onSelectionChange={setSelectedMemberIds}
              />
            )}
            {error && allUsers.length > 0 && <Text style={styles.errorText}>{error}</Text>}
          </>
        );
      case 'submitButton':
        return (
          <View style={styles.buttonsContainer}>
            <Button
              title={isCreatingTeam ? "Creating..." : "Create Team"}
              onPress={handleCreateTeam}
              disabled={teamName.trim() === '' || isCreatingTeam || isLoadingUsers}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.dark.accent}/>
      <Stack.Screen options={{ title: "Create New Team" }} />
      <FlatList
        data={formSections}
        renderItem={renderFormItem}
        keyExtractor={item => item.id}
        style={styles.container} // Use existing container style
        contentContainerStyle={styles.contentContainer} // Use existing content container style
        showsVerticalScrollIndicator={false}
      />
      {/* Modals remain outside the FlatList for proper overlay behavior */}
      <Modal
        transparent={true}
        visible={isTeamTypePickerVisible}
        animationType="slide"
        onRequestClose={() => setIsTeamTypePickerVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsTeamTypePickerVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Team Type</Text>
                  <TouchableOpacity onPress={() => setIsTeamTypePickerVisible(false)}>
                    <Text style={styles.modalDoneButton}>Done</Text>
                  </TouchableOpacity>
                </View>
                <Picker
                  selectedValue={teamType}
                  onValueChange={(itemValue) => {
                    setTeamType(itemValue as TeamType);
                    setIsTeamTypePickerVisible(false); // Close on selection
                  }}
                  style={styles.picker}
                >
                  {Object.values(TeamType).map((type) => (
                    <Picker.Item key={type} label={type.charAt(0).toUpperCase() + type.slice(1)} value={type} />
                  ))}
                </Picker>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        transparent={true}
        visible={isIconPickerVisible}
        animationType="slide"
        onRequestClose={() => setIsIconPickerVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsIconPickerVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Icon</Text>
                  <TouchableOpacity onPress={() => setIsIconPickerVisible(false)}>
                    <Text style={styles.modalDoneButton}>Done</Text>
                  </TouchableOpacity>
                </View>
                <Picker
                  selectedValue={iconName}
                  onValueChange={(itemValue) => {
                    setIconName(itemValue as keyof typeof Ionicons.glyphMap);
                    setIsIconPickerVisible(false); // Close on selection
                  }}
                  style={styles.picker}
                >
                  {availableIcons.map((icon) => (
                    <Picker.Item key={icon} label={icon.replace('-outline', '').replace('-', ' ')} value={icon} />
                  ))}
                </Picker>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

// Removed inline styles as they are now in the imported styles file.

export default CreateNewTeamScreen;

import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  StatusBar,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@/styles/app/(events)/createNewTeam.styles';
import { Colors } from '@/constants/Colors';
import { Stack, useRouter } from 'expo-router';
import { TeamType } from '@/types/teamTypes';
import { UserProfile } from '@/types/userTypes';
import { BackendUser } from '@/types/auth';
import MultiUserPicker from '@/components/common/MultiUserPicker';
import { useAlert } from '@/context/AlertContext';
import { createTeam } from '@/services/teamService';
import { getAllUsersForPicker } from '@/services/userService';
import { AuthContext } from '@/context/AuthContext';

const availableIcons: (keyof typeof Ionicons.glyphMap)[] = [
  'people-outline', 'people-circle-outline', 'school-outline', 'book-outline', 
  'briefcase-outline', 'game-controller-outline', 'musical-notes-outline', 'color-palette-outline'
];

const CreateNewTeamScreen: React.FC = () => {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const currentUser = authContext?.user as (BackendUser & { uid: string }) | undefined;
  const { showSuccess, showError } = useAlert();

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
        const users = await getAllUsersForPicker(!!currentUser, 50);
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
      showError('Validation Error', 'Please enter a team name.');
      return;
    }
    if (!currentUser || !currentUser.uid) {
      showError('Error', 'You must be logged in to create a team.');
      return;
    }

    setIsCreatingTeam(true);
    setError(null);

    try {
      const payload = {
        name: teamName.trim(),
        memberIds: [currentUser.uid, ...selectedMemberIds],
        type: teamType,
        iconName: iconName,
        createdBy: currentUser.uid,
      };
      const newTeam = await createTeam(payload);
      showSuccess('Success', `Team "${newTeam.name}" created successfully!`, {
        onConfirm: () => {
          setTeamName('');
          setSelectedMemberIds([]);
          setTeamType(TeamType.OTHER);
          setIconName(availableIcons[0]);
          router.back();
        },
      });
    } catch (err) {
      console.error('Failed to create team:', err);
      setError('Failed to create team. Please try again.');
      showError('Error', 'Failed to create team. Please try again.');
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
              <ActivityIndicator size="large" color={Colors.light.primary} />
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
              color={Colors.light.primary}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.backgroundSecondary} />
      <Stack.Screen options={{ title: "Create New Team" }} />
      <FlatList
        data={formSections}
        renderItem={renderFormItem}
        keyExtractor={item => item.id}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      />
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
                    setIsTeamTypePickerVisible(false);
                  }}
                  style={styles.picker}
                  itemStyle={{ color: Colors.light.text }}
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
                    setIsIconPickerVisible(false);
                  }}
                  style={styles.picker}
                  itemStyle={{ color: Colors.light.text }}
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

export default CreateNewTeamScreen;

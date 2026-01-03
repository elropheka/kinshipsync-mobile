import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, FlatList, TouchableOpacity, ActivityIndicator, Image, StatusBar, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createAddFamilyMemberScreenStyles } from '../../../styles/app/(teams)/addFamilyMemberScreen.styles';
import { useAppTheme } from '@/context/AppThemeContext'; 
import { UserProfile } from '../../../types/userTypes';
import { FamilyMemberNode } from '../../../types/teamTypes'; 
import { useAppAuth } from '../../../hooks/useAppAuth';
import { useAlert } from '@/context/AlertContext';
import { searchUsersByName } from '../../../services/userService';
import { addMemberToTeam, updateFamilyTreeRoot, getTeamById, addSpouseToFamilyMember } from '../../../services/teamService'; 
import { uploadImage } from '../../../services/storageService'; // Import uploadImage
import { Colors } from '../../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const generateNodeId = () => `node_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

const addChildNodeToTree = (
  currentNode: FamilyMemberNode, 
  parentId: string, 
  childToAdd: FamilyMemberNode
): FamilyMemberNode | null => {
  if (currentNode.id === parentId) {
    const updatedNode = { ...currentNode };
    if (!updatedNode.children) updatedNode.children = [];
    updatedNode.children.push(childToAdd);
    return updatedNode;
  }
  if (currentNode.children) {
    for (let i = 0; i < currentNode.children.length; i++) {
      const result = addChildNodeToTree(currentNode.children[i], parentId, childToAdd);
      if (result) {
        const updatedNode = { ...currentNode };
        updatedNode.children = [...(updatedNode.children || [])];
        updatedNode.children[i] = result;
        return updatedNode;
      }
    }
  }
  return null; 
};

const AddFamilyMemberScreen = () => {
  const { currentColors } = useAppTheme();
  const styles = createAddFamilyMemberScreenStyles(currentColors);


  const params = useLocalSearchParams<{ 
    memberId: string, // For "add child" or "add spouse", this is the ID of the existing member
    teamId: string, 
    isRoot?: string, 
    relationshipType?: 'child' | 'spouse',
    parentName?: string // Name of the member to whom we are adding a relative
  }>();
  const { memberId, teamId, isRoot, relationshipType, parentName: initialTargetMemberName } = params;
  
  const router = useRouter();
  const { user: currentUser, token, isInitialized } = useAppAuth();
  const isAuthenticated = !!currentUser && !!token && isInitialized;
  const { showError, showSuccess, showInfo } = useAlert();

  const [isLoading, setIsLoadingState] = useState(false);

  const [newRootMemberName, setNewRootMemberName] = useState('');
  const [newRootMemberImageUrl, setNewRootMemberImageUrl] = useState('');
  const [isUploadingRootImage, setIsUploadingRootImage] = useState(false);

  const [newChildName, setNewChildName] = useState('');
  const [newChildImageUrl, setNewChildImageUrl] = useState('');
  const [isUploadingChildImage, setIsUploadingChildImage] = useState(false);
  
  const [newSpouseName, setNewSpouseName] = useState('');
  const [newSpouseImageUrl, setNewSpouseImageUrl] = useState('');
  const [isUploadingSpouseImage, setIsUploadingSpouseImage] = useState(false);

  const [targetMemberName] = useState(initialTargetMemberName || '');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
 
  const isAddRootMode = memberId === 'new' && isRoot === 'true';
  const isAddChildMode = memberId !== 'new' && relationshipType === 'child' && teamId;
  const isAddSpouseMode = memberId !== 'new' && relationshipType === 'spouse' && teamId;

  useEffect(() => {
    if ((isAddChildMode || isAddSpouseMode) && !initialTargetMemberName) {
    }
  }, [isAddChildMode, isAddSpouseMode, memberId, teamId, initialTargetMemberName]);

  const handleCreateRootMember = async () => { /* ... same as before ... */ 
    if (!newRootMemberName.trim()) { showError('Validation Error', 'Member name is required.'); return; }
    if (!teamId) { showError('Error', 'Team ID is missing.'); return; }
    if (!isAuthenticated) { showError("Authentication Error", "You must be logged in."); return; }
    setIsLoadingState(true);
    const newNodePayload: any = { id: generateNodeId(), name: newRootMemberName.trim(), parentIds: [], children: [] };
    if (newRootMemberImageUrl.trim()) newNodePayload.imageUrl = newRootMemberImageUrl.trim();
    try {
      await updateFamilyTreeRoot(teamId, newNodePayload as FamilyMemberNode);
      showSuccess('Success', `${newNodePayload.name} added as root.`, {
        onConfirm: () => router.back(),
      });
    } catch (error: any) { showError('Error Creating Root', error.message || 'Failed to create root member.');
    } finally { setIsLoadingState(false); }
  };

  const pickImageAndUpdateState = async (
    setImageUrlStateAction: React.Dispatch<React.SetStateAction<string>>,
    setIsUploadingStateAction: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      showError("Permission Required", "Permission to access camera roll is required.");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (pickerResult.canceled === true) return;

    if (pickerResult.assets && pickerResult.assets.length > 0 && teamId) {
      const imageUri = pickerResult.assets[0].uri;
      setIsUploadingStateAction(true);
      try {
        const uploadResult = await uploadImage(imageUri, 'family_member_images', teamId);
        setImageUrlStateAction(uploadResult.imageUrl);
        showInfo("Image Uploaded", "Image is ready. Save the member to apply.");
      } catch (uploadError: any) {
        showError("Upload Failed", `Could not upload image: ${uploadError.message}`);
      } finally {
        setIsUploadingStateAction(false);
      }
    } else if (!teamId) {
      showError("Error", "Team ID is missing, cannot upload image.");
    }
  };

  const handleAddChildMember = async () => { 
    if (!newChildName.trim()) { showError('Validation Error', "Child's name is required."); return; }
    const parentNodeId = memberId; 
    if (!teamId || !parentNodeId) { showError('Error', 'Team ID or Parent ID is missing.'); return; }
    if (!isAuthenticated) { showError("Authentication Error", "You must be logged in."); return; }
    setIsLoadingState(true);
    const childNodePayload: any = { id: generateNodeId(), name: newChildName.trim(), parentIds: [parentNodeId], children: [] };
    if (newChildImageUrl.trim()) childNodePayload.imageUrl = newChildImageUrl.trim(); // Uses the state updated by image picker
    try {
      const teamData = await getTeamById(isAuthenticated, teamId);
      if (!teamData || !teamData.familyTreeRoot) {
        showError('Error', 'Family tree not found.'); setIsLoadingState(false); return;
      }
      const modifiedTree = addChildNodeToTree(JSON.parse(JSON.stringify(teamData.familyTreeRoot)), parentNodeId, childNodePayload as FamilyMemberNode);
      if (modifiedTree) {
        await updateFamilyTreeRoot(teamId, modifiedTree);
        showSuccess('Success', `${childNodePayload.name} added as a child.`, {
          onConfirm: () => router.back(),
        });
      } else { showError('Error', `Could not find parent with ID ${parentNodeId}.`); }
    } catch (error: any) { showError('Error Adding Child', error.message || 'Failed to add child.');
    } finally { setIsLoadingState(false); }
  };

  const handleAddSpouseMember = async () => {
    if (!newSpouseName.trim()) { showError('Validation Error', "Spouse's name is required."); return; }
    const targetMemberId = memberId; // memberId from route is the person getting a spouse
    if (!teamId || !targetMemberId) { showError('Error', 'Team ID or Member ID is missing.'); return; }
    if (!isAuthenticated) { showError("Authentication Error", "You must be logged in."); return; }

    setIsLoadingState(true);
    const spouseDataPayload: Pick<FamilyMemberNode, 'id' | 'name' | 'imageUrl'> = {
      id: generateNodeId(), // Spouse also gets a unique ID
      name: newSpouseName.trim(),
    };
    if (newSpouseImageUrl.trim()) {
      spouseDataPayload.imageUrl = newSpouseImageUrl.trim();
    }

    try {
      await addSpouseToFamilyMember(teamId, targetMemberId, spouseDataPayload);
      showSuccess('Success', `${spouseDataPayload.name} added as spouse to ${targetMemberName || 'the member'}.`, {
        onConfirm: () => router.back(),
      });
    } catch (error: any) {
      showError('Error Adding Spouse', error.message || 'Failed to add spouse.');
    } finally {
      setIsLoadingState(false);
    }
  };

  const handleSearch = async () => { /* ... same as before ... */ 
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    if (!isAuthenticated) { showError("Auth Error", "Please log in."); return; }
    setIsLoadingSearch(true);
    try {
      const users = await searchUsersByName(isAuthenticated, searchQuery.trim(), 10);
      setSearchResults(users.filter(u => u.userId !== currentUser?.uid));
    } catch (error: any) { showError('Search Error', error.message); setSearchResults([]);
    } finally { setIsLoadingSearch(false); }
  };
  const handleAddExistingUserToTeam = async () => { /* ... same as before ... */ 
    if (!selectedUser || !teamId) { showError('Error', 'Select user and team.'); return; }
    if (!isAuthenticated) { showError("Auth Error", "Please log in."); return; }
    setIsLoadingState(true);
    try {
      await addMemberToTeam(isAuthenticated, teamId, selectedUser.userId, false);
      showSuccess('Success', `${selectedUser.displayName} added to team roster.`, {
        onConfirm: () => router.back(),
      });
    } catch (error: any) { showError('Error Adding Member', error.message);
    } finally { setIsLoadingState(false); }
  };
  const renderUserItem = ({ item }: { item: UserProfile }) => ( /* ... same as before ... */ 
    <TouchableOpacity style={[styles.userItem, selectedUser?.userId === item.userId && styles.selectedUserItem]} onPress={() => setSelectedUser(item)}>
      {item.avatarUrl ? <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
        : <View style={[styles.avatar, styles.avatarPlaceholder]}><Ionicons name="person" size={20} color={currentColors.textSecondary} /></View>}
      <View style={styles.userInfo}><Text style={styles.userName}>{item.displayName || 'N/A'}</Text><Text style={styles.userEmail}>{item.email}</Text></View>
      {selectedUser?.userId === item.userId && <Ionicons name="checkmark-circle" size={24} color={currentColors.success} />}
    </TouchableOpacity>
  );

  if (isAddRootMode) { /* ... same as before ... */ 
    return (
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor={currentColors.backgroundSecondary} />
        <Stack.Screen options={{ title: 'Add Root Family Member' }} />
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.title}>Add Root Family Member</Text>
          {teamId && <Text style={styles.subtitle}>For Team ID: {teamId}</Text>}
          <TextInput style={styles.input} placeholder="Member's Name" value={newRootMemberName} onChangeText={setNewRootMemberName} placeholderTextColor="#888"/>
          
          {newRootMemberImageUrl ? <Image source={{ uri: newRootMemberImageUrl }} style={styles.imagePreview} /> : <View style={styles.imagePlaceholder}><Ionicons name="person-add-outline" size={50} color={currentColors.textSecondary} /></View>}
          <TouchableOpacity style={styles.uploadButton} onPress={() => pickImageAndUpdateState(setNewRootMemberImageUrl, setIsUploadingRootImage)} disabled={isUploadingRootImage}>
            {isUploadingRootImage ? <ActivityIndicator color="#fff" /> : <Text style={styles.uploadButtonText}>Upload Image</Text>}
          </TouchableOpacity>

          <Button title={isLoading ? "Adding..." : "Add Root Member"} onPress={handleCreateRootMember} disabled={isLoading || !newRootMemberName.trim()} color={currentColors.primary}/>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isAddChildMode) { /* ... same as before ... */ 
    return (
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor={currentColors.backgroundSecondary} />
        <Stack.Screen options={{ title: `Add Child ${targetMemberName ? `to ${targetMemberName}` : ''}` }} />
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.title}>Add Child</Text>
          {targetMemberName && <Text style={styles.subtitle}>Child of: {targetMemberName}</Text>}
          {!targetMemberName && memberId && <Text style={styles.subtitle}>Parent ID: {memberId}</Text>}
          <TextInput style={styles.input} placeholder="Child's Name" value={newChildName} onChangeText={setNewChildName} placeholderTextColor="#888"/>

          {newChildImageUrl ? <Image source={{ uri: newChildImageUrl }} style={styles.imagePreview} /> : <View style={styles.imagePlaceholder}><Ionicons name="person-add-outline" size={50} color={currentColors.textSecondary} /></View>}
          <TouchableOpacity style={styles.uploadButton} onPress={() => pickImageAndUpdateState(setNewChildImageUrl, setIsUploadingChildImage)} disabled={isUploadingChildImage}>
            {isUploadingChildImage ? <ActivityIndicator color="#fff" /> : <Text style={styles.uploadButtonText}>Upload Image</Text>}
          </TouchableOpacity>

          <Button title={isLoading ? "Adding..." : "Add Child"} onPress={handleAddChildMember} disabled={isLoading || !newChildName.trim()} color={currentColors.primary}/>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isAddSpouseMode) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor={currentColors.backgroundSecondary} />
        <Stack.Screen options={{ title: `Add Spouse ${targetMemberName ? `to ${targetMemberName}` : ''}` }} />
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.title}>Add Spouse</Text>
          {targetMemberName && <Text style={styles.subtitle}>Spouse for: {targetMemberName}</Text>}
          {!targetMemberName && memberId && <Text style={styles.subtitle}>Adding spouse to member ID: {memberId}</Text>}
          <TextInput style={styles.input} placeholder="Spouse's Name" value={newSpouseName} onChangeText={setNewSpouseName} placeholderTextColor="#888"/>

          {newSpouseImageUrl ? <Image source={{ uri: newSpouseImageUrl }} style={styles.imagePreview} /> : <View style={styles.imagePlaceholder}><Ionicons name="person-add-outline" size={50} color={currentColors.textSecondary} /></View>}
          <TouchableOpacity style={styles.uploadButton} onPress={() => pickImageAndUpdateState(setNewSpouseImageUrl, setIsUploadingSpouseImage)} disabled={isUploadingSpouseImage}>
            {isUploadingSpouseImage ? <ActivityIndicator color="#fff" /> : <Text style={styles.uploadButtonText}>Upload Image</Text>}
          </TouchableOpacity>

          <Button title={isLoading ? "Adding..." : "Add Spouse"} onPress={handleAddSpouseMember} disabled={isLoading || !newSpouseName.trim()} color={currentColors.primary}/>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return ( /* ... same as before ... */ 
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={currentColors.backgroundSecondary} />
      <Stack.Screen options={{ title: 'Add to Team Roster' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Add Existing User to Team Roster</Text>
        {teamId && <Text style={styles.subtitle}>For Team ID: {teamId}</Text>}
        {memberId === 'new' && !isRoot && !relationshipType && (
             <Text style={styles.noResultsText}>Select a relationship type from the family tree view to add a new member.</Text>
        )}
        {memberId !== 'new' && !relationshipType && ( // Existing member ID but no relationshipType means roster add
            <>
                <View style={styles.searchContainer}>
                <TextInput style={styles.searchInput} placeholder="Search user by name..." value={searchQuery} onChangeText={setSearchQuery} placeholderTextColor="#888" onSubmitEditing={handleSearch}/>
                <TouchableOpacity onPress={handleSearch} style={styles.searchButton} disabled={isLoadingSearch}>
                    {isLoadingSearch ? <ActivityIndicator size="small" color={currentColors.primary} /> : <Ionicons name="search" size={24} color={currentColors.primary} />}
                </TouchableOpacity>
                </View>
                {isLoadingSearch && <ActivityIndicator />}
                {searchResults.length > 0 && ( <FlatList data={searchResults} renderItem={renderUserItem} keyExtractor={(item) => item.userId} style={styles.resultsList}/> )}
                {searchQuery.length > 0 && searchResults.length === 0 && !isLoadingSearch && ( <Text style={styles.noResultsText}>No users found.</Text> )}
                {selectedUser && (
                <View style={styles.selectionConfirmation}>
                    <Text style={styles.selectedUserInfo}>Selected: {selectedUser.displayName} ({selectedUser.email})</Text>
                    <Button title={isLoading ? "Adding..." : `Add to Roster`} onPress={handleAddExistingUserToTeam} disabled={isLoading} color={currentColors.primary}/>
                </View>
                )}
            </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AddFamilyMemberScreen;

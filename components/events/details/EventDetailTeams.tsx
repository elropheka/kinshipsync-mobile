import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, SafeAreaView, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventTeam, CreateEventTeamPayload, UpdateEventTeamPayload, AddTeamMemberPayload, TeamMember } from '../../../types/eventTypes';
import { UserProfile } from '../../../types/userTypes';
import EventTeamForm from '../../teams/EventTeamForm'; // Path to existing EventTeamForm
import MultiUserPicker from '../../common/MultiUserPicker'; // Path to MultiUserPicker
import { styles } from '../../../styles/app/(events)/details/[id].styles'; // Adjust path as needed
import { Colors } from '../../../constants/Colors';
import { useAlert } from '@/context/AlertContext';

interface EventDetailTeamsProps {
  eventTeams: EventTeam[];
  assignableUsers: UserProfile[]; // For picking team members
  onCreateEventTeam: (teamData: CreateEventTeamPayload) => Promise<void>;
  onUpdateEventTeam: (teamId: string, teamData: UpdateEventTeamPayload) => Promise<void>;
  onDeleteEventTeam: (teamId: string) => Promise<void>;
  onAddTeamMember: (teamId: string, memberData: AddTeamMemberPayload) => Promise<void>;
  onRemoveTeamMember: (teamId: string, memberUserId: string) => Promise<void>;
  isOrganizer?: boolean;
}

const EventDetailTeams: React.FC<EventDetailTeamsProps> = ({
  eventTeams,
  assignableUsers,
  onCreateEventTeam,
  onUpdateEventTeam,
  onDeleteEventTeam,
  onAddTeamMember,
  onRemoveTeamMember,
  isOrganizer = true
}) => {
  const { showSuccess, showError, showConfirm } = useAlert();
  const [isEventTeamFormVisible, setIsEventTeamFormVisible] = useState(false);
  const [editingEventTeam, setEditingEventTeam] = useState<Partial<Omit<EventTeam, 'members'>> & { id?: string; members?: string[] } | undefined>(undefined);
  const [managingTeamMembersFor, setManagingTeamMembersFor] = useState<EventTeam | null>(null);
  const [isTeamMemberPickerVisible, setIsTeamMemberPickerVisible] = useState(false);
  const [selectedUserForTeam, setSelectedUserForTeam] = useState<UserProfile | null>(null);
  const [selectedRoleForTeamMember, setSelectedRoleForTeamMember] = useState<TeamMember['role']>('helper');

  const handleOpenEventTeamForm = (team?: EventTeam) => {
    if (team) {
      setEditingEventTeam({
        ...team,
        members: team.members ? team.members.map(member => member.userId) : [],
      });
    } else {
      setEditingEventTeam(undefined);
    }
    setIsEventTeamFormVisible(true);
  };

  const handleCloseEventTeamForm = () => {
    setEditingEventTeam(undefined);
    setIsEventTeamFormVisible(false);
  };

  const handleEventTeamFormSubmit = async (teamData: CreateEventTeamPayload | UpdateEventTeamPayload, teamId?: string) => {
    try {
      if (teamId) {
        await onUpdateEventTeam(teamId, teamData as UpdateEventTeamPayload);
        showSuccess('Success', 'Team updated.');
      } else {
        await onCreateEventTeam(teamData as CreateEventTeamPayload);
        showSuccess('Success', 'Team created.');
      }
      handleCloseEventTeamForm();
    } catch (e) {
      console.error("Failed to submit event team:", e);
      showError('Error', 'Failed to save team.');
    }
  };

  const handleDeleteTeamPress = (teamId: string) => {
    showConfirm(
      'warning',
      "Confirm Delete",
      "Are you sure you want to delete this team and its members?",
      async () => {
        try { 
          await onDeleteEventTeam(teamId); 
          showSuccess('Success', 'Team deleted.');
        } 
        catch { 
          showError("Error", "Failed to delete team.");
        }
      },
      {
        confirmText: "Delete",
        cancelText: "Cancel",
      }
    );
  };

  const handleOpenTeamMemberModal = (team: EventTeam) => {
    setManagingTeamMembersFor(team);
    setSelectedUserForTeam(null); 
    setSelectedRoleForTeamMember('helper'); 
    setIsTeamMemberPickerVisible(true);
  };

  const handleConfirmAddTeamMember = async () => {
    if (!managingTeamMembersFor || !selectedUserForTeam) {
      showError("Error", "Please select a team and a user.");
      return;
    }
    try {
      await onAddTeamMember(managingTeamMembersFor.id, { 
        userId: selectedUserForTeam.userId, 
        role: selectedRoleForTeamMember 
      });
      showSuccess("Success", `${selectedUserForTeam.displayName} added to ${managingTeamMembersFor.name}.`);
      setIsTeamMemberPickerVisible(false);
      setManagingTeamMembersFor(null);
    } catch (e) {
      console.error("Error adding team member:", e);
      showError("Error", "Failed to add team member.");
    }
  };
  
  const handleRemoveMemberPress = async (teamId: string, memberUserId: string) => {
    showConfirm(
      'warning',
      "Confirm Remove",
      "Are you sure you want to remove this member?",
      async () => {
        try {
          await onRemoveTeamMember(teamId, memberUserId);
          showSuccess("Success", "Member removed.");
        } catch {
          showError("Error", "Failed to remove member.");
        }
      },
      {
        confirmText: "Remove",
        cancelText: "Cancel",
      }
    );
  };

  const renderEventTeamItem = ({ item: team }: { item: EventTeam }) => (
    <View style={styles.teamItemContainer}>
      <View style={styles.teamHeader}>
        <TouchableOpacity 
          onPress={isOrganizer ? () => handleOpenEventTeamForm(team) : undefined} 
          style={{flex:1}}
          disabled={!isOrganizer}
        >
          <Text style={styles.teamName}>{team.name}</Text>
        </TouchableOpacity>
        {isOrganizer && (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => handleOpenTeamMemberModal(team)} style={{ marginRight: 10 }}>
              <Ionicons name="person-add-outline" size={24} color={Colors.light.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteTeamPress(team.id)}>
              <Ionicons name="trash-outline" size={24} color={Colors.light.error} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {team.members && team.members.length > 0 ? (
        team.members.map((member, index) => {
          const memberProfile = assignableUsers.find(u => u.userId === member.userId);
          return (
            <View key={index} style={styles.teamMemberItem}>
              <Text style={styles.teamMemberName}>{memberProfile?.displayName || member.userId} ({member.role})</Text>
              {isOrganizer && (
                <TouchableOpacity onPress={() => handleRemoveMemberPress(team.id, member.userId)}>
                  <Ionicons name="remove-circle-outline" size={20} color={Colors.light.error} />
                </TouchableOpacity>
              )}
            </View>
          );
        })
      ) : (
        <Text style={styles.emptyListTextSmall}>No members in this team yet.</Text>
      )}
    </View>
  );

  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Event Teams</Text>
        {isOrganizer && (
          <TouchableOpacity onPress={() => handleOpenEventTeamForm()}>
            <Ionicons name="add-circle-outline" size={28} color={Colors.light.primary} />
          </TouchableOpacity>
        )}
      </View>
      {eventTeams.length > 0 ? (
        <FlatList
          data={eventTeams}
          renderItem={renderEventTeamItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.taskSeparator} />}
        />
      ) : (
        <Text style={styles.emptyListText}>No teams created yet.</Text>
      )}

      <Modal visible={isEventTeamFormVisible} animationType="slide" onRequestClose={handleCloseEventTeamForm}>
        <EventTeamForm 
          initialTeam={editingEventTeam} 
          onSubmit={handleEventTeamFormSubmit} 
          onCancel={handleCloseEventTeamForm} 
        />
      </Modal>

      <Modal visible={isTeamMemberPickerVisible} animationType="slide" onRequestClose={() => setIsTeamMemberPickerVisible(false)}>
        <SafeAreaView style={{flex:1}}>
          <StatusBar barStyle="dark-content" backgroundColor={Colors.light.backgroundSecondary} />
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setIsTeamMemberPickerVisible(false)} style={styles.headerButton}>
              <Ionicons name="close-outline" size={28} color={Colors.light.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Member to {managingTeamMembersFor?.name}</Text>
            <TouchableOpacity onPress={handleConfirmAddTeamMember} style={styles.headerButton} disabled={!selectedUserForTeam}>
              <Text style={[styles.headerButtonText, !selectedUserForTeam && {color: Colors.light.textSecondary}]}>Add</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.modalSubtitle}>Select User:</Text>
          <MultiUserPicker 
            users={assignableUsers} 
            selectedUserIds={selectedUserForTeam ? [selectedUserForTeam.userId] : []}
            onSelectionChange={(ids) => {
              const user = assignableUsers.find(u => u.userId === ids[0]);
              setSelectedUserForTeam(user || null);
            }}
          />
          <Text style={styles.modalSubtitle}>Select Role:</Text>
          <View style={styles.roleSelectorContainer}>
            {(['admin', 'coordinator', 'helper'] as TeamMember['role'][]).map(role => (
              <TouchableOpacity 
                key={role} 
                style={[styles.roleButton, selectedRoleForTeamMember === role && styles.roleButtonSelected]}
                onPress={() => setSelectedRoleForTeamMember(role)}
              >
                <Text style={[styles.roleButtonText, selectedRoleForTeamMember === role && styles.roleButtonTextSelected]}>{role}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default EventDetailTeams;

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Idea, CreateIdeaPayload, UpdateIdeaPayload } from '../../../types/eventTypes';
import IdeaForm from '../../ideas/IdeaForm'; // Path to existing IdeaForm
import { styles } from '../../../styles/app/(events)/details/[id].styles'; // Adjust path as needed
import { Colors } from '../../../constants/Colors';
import CustomAlert from '../../common/alert';

interface EventDetailIdeasProps {
  ideas: Idea[];
  currentUserId?: string;
  onAddIdea: (ideaData: CreateIdeaPayload, currentUserId: string) => Promise<void>;
  onUpdateIdea: (ideaId: string, ideaData: UpdateIdeaPayload) => Promise<void>;
  onDeleteIdea: (ideaId: string) => Promise<void>;
  onVoteForIdea: (ideaId: string, increment: number) => Promise<void>;
  isOrganizer?: boolean;
}

const EventDetailIdeas: React.FC<EventDetailIdeasProps> = ({
  ideas,
  currentUserId,
  onAddIdea,
  onUpdateIdea,
  onDeleteIdea,
  onVoteForIdea,
  isOrganizer = true
}) => {
  const [isIdeaFormVisible, setIsIdeaFormVisible] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Partial<Idea> & { id?: string } | undefined>(undefined);

  // Custom alert state
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
    showCancelButton?: boolean;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
    showCancelButton: false,
    onConfirm: undefined,
    confirmText: 'OK',
    cancelText: 'Cancel',
  });

  const showAlert = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setAlertConfig({ visible: true, type, title, message, showCancelButton: false });
  };

  const showConfirmAlert = (
    type: 'success' | 'error' | 'info',
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  ) => {
    setAlertConfig({ 
      visible: true, 
      type, 
      title, 
      message, 
      showCancelButton: true, 
      onConfirm, 
      confirmText, 
      cancelText 
    });
  };

  const hideAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };

  const handleOpenIdeaForm = (item?: Partial<Idea> & { id?: string }) => {
    setEditingIdea(item);
    setIsIdeaFormVisible(true);
  };

  const handleCloseIdeaForm = () => {
    setEditingIdea(undefined);
    setIsIdeaFormVisible(false);
  };

  const handleIdeaFormSubmit = async (ideaData: CreateIdeaPayload | UpdateIdeaPayload, ideaId?: string) => {
    if (!currentUserId && !ideaId) { // currentUserId is needed for new ideas
        showAlert("error", "Error", "User not authenticated.");
        return;
    }
    try {
      if (ideaId) {
        await onUpdateIdea(ideaId, ideaData as UpdateIdeaPayload);
        showAlert('success', 'Success', 'Idea updated.');
      } else if (currentUserId) { // Ensure currentUserId is present for adding new idea
        await onAddIdea(ideaData as CreateIdeaPayload, currentUserId);
        showAlert('success', 'Success', 'Idea added.');
      }
      handleCloseIdeaForm();
    } catch (e) {
      console.error("Failed to submit idea:", e);
      showAlert('error', 'Error', 'Failed to save idea.');
    }
  };

  const handleDeletePress = (ideaId: string) => {
    const handleConfirmDelete = async () => {
      try { 
        await onDeleteIdea(ideaId); 
        showAlert('success', 'Success', 'Idea deleted.');
      } 
      catch { showAlert("error", "Error", "Failed to delete idea."); }
    };

    showConfirmAlert(
      'info',
      "Confirm Delete", 
      "Are you sure you want to delete this idea?",
      handleConfirmDelete,
      'Delete',
      'Cancel'
    );
  };

  const handleVote = async (ideaId: string, increment: number) => {
    try { 
      await onVoteForIdea(ideaId, increment); 
    } catch (e) { 
      console.error("Error voting for idea:", e); 
      showAlert("error", "Error", "Failed to record vote."); 
    }
  };

  const renderIdeaItem = ({ item }: { item: Idea }) => (
    <View style={styles.ideaItemContainer}>
      <View style={styles.ideaContent}>
        <TouchableOpacity 
          onPress={isOrganizer ? () => handleOpenIdeaForm(item) : undefined}
          disabled={!isOrganizer}
        >
          <Text style={styles.ideaTitle}>{item.title}</Text>
          {item.description && <Text style={styles.ideaDescription} numberOfLines={2}>{item.description}</Text>}
        </TouchableOpacity>
        <Text style={styles.ideaSubmittedBy}>Submitted by: {item.submitterName || item.createdBy}</Text> 
      </View>
      <View style={styles.voteContainer}>
        <TouchableOpacity onPress={() => handleVote(item.id, 1)}>
          <Ionicons name="arrow-up-circle-outline" size={28} color={Colors.light.success} />
        </TouchableOpacity>
        <Text style={styles.voteCount}>{item.votes}</Text>
        <TouchableOpacity onPress={() => handleVote(item.id, -1)}>
          <Ionicons name="arrow-down-circle-outline" size={28} color={Colors.light.error} />
        </TouchableOpacity>
        {isOrganizer && (
          <TouchableOpacity onPress={() => handleDeletePress(item.id)} style={{ marginLeft: 15 }}>
            <Ionicons name="trash-outline" size={24} color={Colors.light.error} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Ideas</Text>
        {isOrganizer && (
          <TouchableOpacity onPress={() => handleOpenIdeaForm()}>
            <Ionicons name="add-circle-outline" size={28} color={Colors.light.primary} />
          </TouchableOpacity>
        )}
      </View>
      {ideas.length > 0 ? (
        <FlatList
          data={ideas}
          renderItem={renderIdeaItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.taskSeparator} />}
        />
      ) : (
        <Text style={styles.emptyListText}>No ideas yet. Add one!</Text>
      )}
      <Modal visible={isIdeaFormVisible} animationType="slide" onRequestClose={handleCloseIdeaForm}>
        <IdeaForm 
          initialIdea={editingIdea} 
          onSubmit={handleIdeaFormSubmit} 
          onCancel={handleCloseIdeaForm} 
          formTitle={editingIdea ? 'Edit Idea' : 'Add New Idea'} 
        />
      </Modal>
      
      {/* Custom Alert */}
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        showCancelButton={alertConfig.showCancelButton}
        onClose={hideAlert}
        onConfirm={alertConfig.onConfirm}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        position="center"
        showIcon={true}
        closable={true}
      />
    </View>
  );
};

export default EventDetailIdeas;

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Idea, CreateIdeaPayload, UpdateIdeaPayload } from '../../../types/eventTypes';
import IdeaForm from '../../ideas/IdeaForm'; // Path to existing IdeaForm
import { styles } from '../../../styles/app/(events)/details/[id].styles'; // Adjust path as needed
import { Colors } from '../../../constants/Colors';

interface EventDetailIdeasProps {
  ideas: Idea[];
  currentUserId?: string;
  onAddIdea: (ideaData: CreateIdeaPayload, currentUserId: string) => Promise<void>;
  onUpdateIdea: (ideaId: string, ideaData: UpdateIdeaPayload) => Promise<void>;
  onDeleteIdea: (ideaId: string) => Promise<void>;
  onVoteForIdea: (ideaId: string, increment: number) => Promise<void>;
}

const EventDetailIdeas: React.FC<EventDetailIdeasProps> = ({
  ideas,
  currentUserId,
  onAddIdea,
  onUpdateIdea,
  onDeleteIdea,
  onVoteForIdea,
}) => {
  const [isIdeaFormVisible, setIsIdeaFormVisible] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Partial<Idea> & { id?: string } | undefined>(undefined);

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
        Alert.alert("Error", "User not authenticated.");
        return;
    }
    try {
      if (ideaId) {
        await onUpdateIdea(ideaId, ideaData as UpdateIdeaPayload);
        Alert.alert('Success', 'Idea updated.');
      } else if (currentUserId) { // Ensure currentUserId is present for adding new idea
        await onAddIdea(ideaData as CreateIdeaPayload, currentUserId);
        Alert.alert('Success', 'Idea added.');
      }
      handleCloseIdeaForm();
    } catch (e) {
      console.error("Failed to submit idea:", e);
      Alert.alert('Error', 'Failed to save idea.');
    }
  };

  const handleDeletePress = (ideaId: string) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this idea?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        try { 
          await onDeleteIdea(ideaId); 
          Alert.alert('Success', 'Idea deleted.');
        } 
        catch (e) { Alert.alert("Error", "Failed to delete idea."); }
      }}
    ]);
  };

  const handleVote = async (ideaId: string, increment: number) => {
    try { 
      await onVoteForIdea(ideaId, increment); 
    } catch (e) { 
      console.error("Error voting for idea:", e); 
      Alert.alert("Error", "Failed to record vote."); 
    }
  };

  const renderIdeaItem = ({ item }: { item: Idea }) => (
    <View style={styles.ideaItemContainer}>
      <View style={styles.ideaContent}>
        <TouchableOpacity onPress={() => handleOpenIdeaForm(item)}>
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
          <TouchableOpacity onPress={() => handleDeletePress(item.id)} style={{ marginLeft: 15 }}>
            <Ionicons name="trash-outline" size={24} color={Colors.light.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Ideas</Text>
        <TouchableOpacity onPress={() => handleOpenIdeaForm()}>
          <Ionicons name="add-circle-outline" size={28} color={Colors.light.primary} />
        </TouchableOpacity>
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
    </View>
  );
};

export default EventDetailIdeas;

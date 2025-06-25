import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { styles } from '../../../styles/components/common/Layout/teams.styles'; // Adjusted path
import { SuggestedTeam } from '../../../types/teamTypes'; // Adjusted path

interface SuggestedTeamListItemProps {
  suggestedTeam: SuggestedTeam;
}

const SuggestedTeamListItem: React.FC<SuggestedTeamListItemProps> = ({ suggestedTeam }) => {
  return (
    <View style={styles.suggestedTeamCard}>
      <Text style={styles.suggestedTeamTitle}>Suggested Team</Text>
      <Text style={styles.suggestedTeamDescription}>{suggestedTeam.description}</Text>
      <TouchableOpacity style={styles.createSuggestedTeamButton}>
        <Text style={styles.createSuggestedTeamButtonText}>{suggestedTeam.actionText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SuggestedTeamListItem;

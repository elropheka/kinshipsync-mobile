import React from 'react';
import { View, Text, Image } from 'react-native';
import { FamilyMemberNode } from '../../types/teamTypes';
import { styles } from '../../styles/components/teams/FamilyMemberNode.styles';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors'; // Import Colors

interface FamilyMemberNodeProps {
  node: FamilyMemberNode | Pick<FamilyMemberNode, 'id' | 'name' | 'imageUrl'>; // Allow Pick for spouse
  onAddChildPress?: () => void;    // New prop for adding a child
  onAddSpousePress?: () => void;   // New prop for adding a spouse
  onRemovePress?: () => void;
}

const FamilyMemberNodeComponent: React.FC<FamilyMemberNodeProps> = ({ 
  node, 
  onAddChildPress, 
  onAddSpousePress, 
  onRemovePress 
}) => {
  const isFullNode = 'parentIds' in node || 'children' in node || 'spouse' in node;
  // A node can have a spouse added if it's a full node and doesn't already have one,
  // or if it's a 'Pick' type (which represents a spouse already and thus cannot have another spouse added to ITSELF).
  // For simplicity, only allow adding spouse to a "full node" that doesn't have one.
  const canAddSpouse = isFullNode && !('spouse' in node && node.spouse);


  return (
    <View style={styles.nodeContainer}>
      <View style={styles.nodeContent}>
        {node.imageUrl ? (
          <Image source={{ uri: node.imageUrl }} style={styles.nodeImage} />
        ) : (
          <View style={[styles.nodeImage, styles.avatarPlaceholder]}>
            <Ionicons name="person-circle-outline" size={40} color={Colors.light.textSecondary} />
          </View>
        )}
        {/* Action Icons - Absolutely Positioned */}
        {isFullNode && onRemovePress && (
          <TouchableOpacity onPress={onRemovePress} style={[styles.iconButton, styles.removeNodeIcon]}>
            <Ionicons name="remove-circle-outline" size={22} color={Colors.light.danger} />
          </TouchableOpacity>
        )}
        {isFullNode && onAddChildPress && (
          <TouchableOpacity onPress={onAddChildPress} style={[styles.iconButton, styles.addChildIcon]}>
            <Ionicons name="person-add-outline" size={22} color={Colors.light.primary} />
          </TouchableOpacity>
        )}
        {canAddSpouse && onAddSpousePress && (
          <TouchableOpacity onPress={onAddSpousePress} style={[styles.iconButton, styles.addSpouseIcon]}>
            <Ionicons name="heart-outline" size={22} color={Colors.light.accent} />
          </TouchableOpacity>
        )}
        
        <Text style={styles.nodeName}>{node.name}</Text>
      </View>
    </View>
  );
};

export default FamilyMemberNodeComponent;

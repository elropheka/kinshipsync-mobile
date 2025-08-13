import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Added useFocusEffect
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import FamilyMemberNodeComponent from '@/components/teams/FamilyMemberNode';
import { FamilyMemberNode, Team } from '@/types/teamTypes';
import { getTeamById, removeFamilyTreeNode } from '../../../services/teamService'; // Import removeFamilyTreeNode
import { styles } from '../../../styles/app/(teams)/familyTreeScreen.styles';
import { Colors } from '../../../constants/Colors';

// Helper function to find a node by ID in the tree
const findNodeById = (
  node: FamilyMemberNode | null | undefined, 
  targetId: string
): FamilyMemberNode | null => {
  if (!node) return null;
  if (node.id === targetId) return node;

  if (node.spouse && node.spouse.id === targetId) {
    // The spouse is Pick<>, not a full FamilyMemberNode for further recursion here.
    // If we need to return the spouse as a FamilyMemberNode, this needs adjustment
    // or the caller needs to handle the Pick<> type.
    // For now, returning as is, assuming targetId refers to main nodes or caller handles spouse.
    return node.spouse as FamilyMemberNode; // Casting, be cautious if spouse isn't always full node
  }

  if (node.children) {
    for (const child of node.children) {
      const found = findNodeById(child, targetId);
      if (found) return found;
    }
  }
  return null;
};

const FamilyTreeScreen = () => {
  const { teamId } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const [teamName, setTeamName] = useState<string>('');
  const [familyTreeData, setFamilyTreeData] = useState<FamilyMemberNode | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadFamilyTreeData = useCallback(async () => {
    if (teamId && typeof teamId === 'string') {
      setIsLoading(true);
      setError(null);
      try {
        const team: Team | null = await getTeamById(true, teamId); // Assuming true for isAuthenticated
        if (team) {
          setTeamName(team.name || '');
          setFamilyTreeData(team.familyTreeRoot || null);
        } else {
          setError("Team not found.");
          setTeamName('');
          setFamilyTreeData(null);
        }
      } catch (err) {
        console.error("Failed to fetch family tree:", err);
        if (err instanceof Error) {
          setError(`Failed to load family tree data: ${err.message}`);
        } else {
          setError("Failed to load family tree data due to an unknown error.");
        }
        setFamilyTreeData(null); // Clear data on error
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Invalid Team ID provided.");
      setIsLoading(false);
      setFamilyTreeData(null);
      setTeamName('');
    }
  }, [teamId]); // Add any other dependencies loadFamilyTreeData might have if they change

  useEffect(() => {
    loadFamilyTreeData();
  }, [loadFamilyTreeData]); // Runs when teamId (via loadFamilyTreeData dependency) changes

  useFocusEffect(
    useCallback(() => {
      // This will run when the screen comes into focus, including when navigating back.
      loadFamilyTreeData();
      return () => {
        // Optional: Any cleanup when the screen goes out of focus
        // For example, if you had a subscription, you might unsubscribe here.
      };
    }, [loadFamilyTreeData]) // Re-run if loadFamilyTreeData changes (i.e. teamId changes)
  );

  const handleHeaderAddPress = () => {
    if (typeof teamId === 'string') {
      if (!familyTreeData) { // Tree is empty, add root
        router.push(`/(teams)/addFamilyMember/new?teamId=${teamId}&isRoot=true`);
      } else { // Tree exists
        router.push(`/(teams)/addFamilyMember/new?teamId=${teamId}`);
      }
    } else {
      Alert.alert("Error", "Team ID is missing, cannot add member.");
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleHeaderAddPress} style={{ marginRight: 15 }}>
          <Ionicons name="add-circle-outline" size={28} color={Colors.light.primary} />
        </TouchableOpacity>
      ),
      // Ensure title is also set if it was dynamic or needs to be preserved
      title: teamName || (teamId ? `Team: ${teamId}` : 'Family Tree'),
    });
  }, [navigation, familyTreeData, teamId, teamName]); // Added teamName to dependencies

  const navigateToAddMember = (memberNodeId: string, relationshipType: 'child' | 'spouse') => {
    if (typeof teamId === 'string') {
      // Pass parentName to prefill or give context on the add screen
      const parentNode = findNodeById(familyTreeData, memberNodeId); // Helper needed or fetch parent name
      const parentNameParam = parentNode ? `&parentName=${encodeURIComponent(parentNode.name)}` : '';
      router.push(`/(teams)/addFamilyMember/${memberNodeId}?teamId=${teamId}&relationshipType=${relationshipType}${parentNameParam}`);
    } else {
      console.error("Cannot navigate to add member: teamId is undefined or not a string");
      Alert.alert("Error", "Cannot proceed without a valid team ID.");
    }
  };

  const handleRemoveMember = async (memberIdToRemove: string) => {
    if (!teamId || typeof teamId !== 'string') {
      Alert.alert("Error", "Team ID is missing.");
      return;
    }

    Alert.alert(
      "Confirm Removal",
      "Are you sure you want to remove this family member? This action will permanently delete them from the family tree.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              await removeFamilyTreeNode(teamId, memberIdToRemove);
              Alert.alert("Success", "Member removed successfully.");
              loadFamilyTreeData(); // Refresh the tree from Firestore
            } catch (error: any) {
              console.error("Failed to remove member:", error);
              Alert.alert("Error", error.message || "Failed to remove member.");
              setIsLoading(false); // Stop loading only on error, success will refresh
            }
            // setIsLoading(false) will be called by loadFamilyTreeData's finally block
          },
        },
      ]
    );
  };
  
  const renderNode = (node: FamilyMemberNode, level: number = 0): JSX.Element | null => {
    if (!node) return null;
    const nodeAndSpouse = (
      <View style={styles.nodeAndSpouseContainer}>
        <FamilyMemberNodeComponent
          node={node}
          onAddChildPress={() => navigateToAddMember(node.id, 'child')}
          onAddSpousePress={() => navigateToAddMember(node.id, 'spouse')}
          onRemovePress={() => handleRemoveMember(node.id)}
        />
        {node.spouse && (
          <>
            <View style={styles.lineHorizontal} />
            <FamilyMemberNodeComponent
              node={node.spouse} 
              // Spouse node typically doesn't have add child/spouse actions from itself in this representation
              onRemovePress={() => handleRemoveMember(node.spouse!.id)} 
            />
          </>
        )}
      </View>
    );
    return (
      <View key={node.id} style={[styles.nodeWrapper, { marginLeft: level > 0 ? 20 : 0 }]}>
        {level > 0 && <View style={styles.lineVerticalShortToParent} />}
        {nodeAndSpouse}
        {node.children && node.children.length > 0 && (
          <View style={styles.childrenContainerActual}>
            <View style={styles.lineVerticalFromParent} />
            {node.children.length > 0 && <View style={styles.lineHorizontalForChildren} />}
            <View style={styles.childrenRow}>
              {node.children.map((child) => (
                <View key={child.id} style={styles.childWrapper}>
                  {renderNode(child, level + 1)}
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={screenStyles.safeArea} edges={['left', 'right', 'bottom']}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text>Loading family tree...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={screenStyles.safeArea} edges={['left', 'right', 'bottom']}>
        <View style={styles.container}>
          <Text style={styles.title}>Error</Text>
          <Text>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!familyTreeData) {
    return (
      <SafeAreaView style={screenStyles.safeArea} edges={['left', 'right', 'bottom']}>
        <View style={styles.container}>
          <Text style={styles.title}>Family Tree: {teamId}</Text>
          <Text>No family tree data available for this team.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={screenStyles.safeArea} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.dark.accent} />
      <ScrollView 
        contentContainerStyle={styles.scrollViewContainer}
        horizontal={true}
      >
        <View style={styles.container}>
          {/* <Text style={styles.title}>Family Tree: {teamId}</Text> */}
          {renderNode(familyTreeData)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const screenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
});

export default FamilyTreeScreen;

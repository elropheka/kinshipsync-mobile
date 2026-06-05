import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import FamilyMemberNodeComponent from '@/components/teams/FamilyMemberNode';
import { FamilyMemberNode, Team } from '@/types/teamTypes';
import { getTeamById, removeFamilyTreeNode } from '@/services/teamService';
import { createFamilyTreeScreenStyles } from '@/styles/app/(teams)/familyTreeScreen.styles';
import { useAppTheme } from '@/context/AppThemeContext';
import { Colors } from '@/constants/Colors';
import { useAlert } from '@/context/AlertContext';
import { HeaderButtonItems } from '@/components/common/Navigation/HeaderButtonItems';

const findNodeById = (
  node: FamilyMemberNode | null | undefined, 
  targetId: string
): FamilyMemberNode | null => {
  if (!node) return null;
  if (node.id === targetId) return node;

  if (node.spouse && node.spouse.id === targetId) {
    return node.spouse as FamilyMemberNode;
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
  const { currentColors } = useAppTheme();
  const styles = createFamilyTreeScreenStyles(currentColors);


  const { teamId } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const { showError, showSuccess, showConfirm } = useAlert();
  const [teamName, setTeamName] = useState<string>('');
  const [familyTreeData, setFamilyTreeData] = useState<FamilyMemberNode | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadFamilyTreeData = useCallback(async () => {
    if (teamId && typeof teamId === 'string') {
      setIsLoading(true);
      setError(null);
      try {
        const team: Team | null = await getTeamById(true, teamId);
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
        setFamilyTreeData(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Invalid Team ID provided.");
      setIsLoading(false);
      setFamilyTreeData(null);
      setTeamName('');
    }
  }, [teamId]);

  useEffect(() => {
    loadFamilyTreeData();
  }, [loadFamilyTreeData]);

  useFocusEffect(
    useCallback(() => {
      loadFamilyTreeData();
      return () => {
      };
    }, [loadFamilyTreeData])
  );

  const handleHeaderAddPress = () => {
    if (typeof teamId === 'string') {
      if (!familyTreeData) {
        router.push(`/(teams)/addFamilyMember/new?teamId=${teamId}&isRoot=true`);
      } else {
        router.push(`/(teams)/addFamilyMember/new?teamId=${teamId}`);
      }
    } else {
      showError("Error", "Team ID is missing, cannot add member.");
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: teamName || (teamId ? `Team: ${teamId}` : 'Family Tree'),
      ...HeaderButtonItems.headerRightIconOptions({
        label: 'Add member',
        sfSymbol: 'plus.circle',
        ionicon: 'add-circle-outline',
        onPress: handleHeaderAddPress,
        tintColor: currentColors.text,
      }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, familyTreeData, teamId, teamName]); // handleHeaderAddPress is stable

  const navigateToAddMember = (memberNodeId: string, relationshipType: 'child' | 'spouse') => {
    if (typeof teamId === 'string') {
      const parentNode = findNodeById(familyTreeData, memberNodeId);
      const parentNameParam = parentNode ? `&parentName=${encodeURIComponent(parentNode.name)}` : '';
      router.push(`/(teams)/addFamilyMember/${memberNodeId}?teamId=${teamId}&relationshipType=${relationshipType}${parentNameParam}`);
    } else {
      console.error("Cannot navigate to add member: teamId is undefined or not a string");
      showError("Error", "Cannot proceed without a valid team ID.");
    }
  };

  const handleRemoveMember = async (memberIdToRemove: string) => {
    if (!teamId || typeof teamId !== 'string') {
      showError("Error", "Team ID is missing.");
      return;
    }

    showConfirm(
      'warning',
      "Confirm Removal",
      "Are you sure you want to remove this family member? This action will permanently delete them from the family tree.",
      async () => {
        setIsLoading(true);
        try {
          await removeFamilyTreeNode(teamId, memberIdToRemove);
          showSuccess("Success", "Member removed successfully.");
          loadFamilyTreeData();
        } catch (error: any) {
          console.error("Failed to remove member:", error);
          showError("Error", error.message || "Failed to remove member.");
        } finally {
          setIsLoading(false);
        }
      },
      {
        confirmText: "Remove",
        cancelText: "Cancel",
      }
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
          <ActivityIndicator size="large" color={currentColors.primary} />
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
      <StatusBar barStyle="dark-content" backgroundColor={currentColors.backgroundSecondary} />
      <ScrollView 
        contentContainerStyle={styles.scrollViewContainer}
        horizontal={true}
      >
        <View style={styles.container}>
          {renderNode(familyTreeData)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const screenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: currentColors.background,
  },
});

export default FamilyTreeScreen;

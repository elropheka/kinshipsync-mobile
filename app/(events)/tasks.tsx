import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet , StatusBar} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router'; // Added Stack import here
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../styles/app/(events)/tasks.styles';
import { Colors } from '@/constants/Colors';

// Define interfaces
interface TaskCategory {
  id: string;
  title: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

const TasksTimelinePage: React.FC = () => {
  // Task categories data
  const taskCategories: TaskCategory[] = [
    {
      id: '1',
      title: 'To-Do Lists',
      description: 'Assign tasks to different people',
      iconName: 'checkmark-circle-outline',
    },
    {
      id: '2',
      title: 'Sign-Up Sheet',
      description: 'Sign up to bring different food items',
      iconName: 'list-outline',
    },
    {
      id: '3',
      title: 'Reminders & Deadlines',
      description: 'Set deadlines and reminders to keep everything on track',
      iconName: 'notifications-outline',
    },
    {
      id: '4',
      title: 'Timeline',
      description: 'Generate a schedule to ensure tasks are completed on time',
      iconName: 'checkmark-circle-outline',
    },
  ];

  // Render each task category item
  const renderTaskCategoryItem = ({ item }: { item: TaskCategory }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <View style={styles.iconContainer}>
        <Ionicons name={item.iconName} size={24} color="#000" />
      </View>
      <View style={styles.categoryContent}>
        <Text style={styles.categoryTitle}>{item.title}</Text>
        <Text style={styles.categoryDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.accent} />
      {/* Header */}
      <Stack.Screen options={{ title: "Tasks" }} /> {/* Ensure title is set if not already by layout */}
      {/* Header View removed - this diff just corrects the import location */}
      
      {/* Divider */}
      <View style={styles.divider} />

      {/* Task Categories List */}
      <FlatList
        data={taskCategories}
        renderItem={renderTaskCategoryItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Bar Indicator */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarIndicator} />
      </View>
    </SafeAreaView>
  );
};

export default TasksTimelinePage;

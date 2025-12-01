import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext'; // Assuming you have a ThemeContext

const BackButton: React.FC = () => {
  const router = useRouter();
  useTheme(); // Theme not used but may be needed for future styling

  if (!router.canGoBack()) {
    return null; // Don't render if there's no screen to go back to
  }

  return (
    <TouchableOpacity onPress={() => router.back()} style={styles.button}>
      <Ionicons
        name="chevron-back"
        size={28} // Slightly larger for better tap target
        color="white" // White color to match header titles
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginLeft: 10, // Standard iOS back button margin
    paddingVertical: 0, // Remove vertical padding
    paddingHorizontal: 5, // Keep horizontal padding for touch
  },
});

export default BackButton;

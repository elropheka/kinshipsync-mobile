import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors'; // Assuming alias works, adjust if not

export const styles = StyleSheet.create({
  nodeContainer: {
    alignItems: 'center',
    marginVertical: 10,
    // backgroundColor: '#f0f0f0', // for debugging layout
    padding: 5,
    position: 'relative', // For icon positioning
  },
  nodeContent: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  nodeImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
    // Ensure placeholder also has a background if needed, or is transparent
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.divider, // Use divider color for placeholder background
  },
  nodeName: {
    fontSize: 14,
    fontWeight: 'bold',
    // marginTop: 5, // Remove if icons are not in normal flow above it
  },
  iconButton: { // Common style for all icon buttons
    position: 'absolute',
    padding: 3, // A little padding around the icon
    backgroundColor: Colors.light.background, // Small background to lift icon off border
    borderRadius: 15, // Make it circular
    zIndex: 1, // Ensure icons are above nodeContent border
  },
  removeNodeIcon: {
    top: -10, // Adjust for visual centering on the border
    left: -10,
  },
  addChildIcon: {
    top: -10,
    right: -10,
  },
  addSpouseIcon: {
    bottom: -10,
    right: -10,
  }
});

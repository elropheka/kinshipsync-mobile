import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export const createFamilyMemberNodeStyles = (theme: typeof Colors.light) => StyleSheet.create({
  nodeContainer: {
    alignItems: 'center',
    marginVertical: 10,
    padding: 5,
    position: 'relative',
  },
  nodeContent: {
    borderWidth: 1,
    borderColor: theme.accent,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  nodeImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
    backgroundColor: theme.accent

  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
    color: theme.accent,
  },
  nodeName: {
    fontSize: 14,
    fontWeight: 'bold',

  },
  iconButton: {
    position: 'absolute',
    padding: 3,
    backgroundColor: theme.background,
    borderRadius: 15,
    zIndex: 1,
  },
  removeNodeIcon: {
    top: -10,
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

// For backwards compatibility, export the light theme styles
export const styles = createFamilyMemberNodeStyles(Colors.light);
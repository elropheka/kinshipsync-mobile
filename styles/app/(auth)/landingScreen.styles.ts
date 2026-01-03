import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const createLandingScreenStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundSecondary,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createLandingScreenStyles(Colors.light);
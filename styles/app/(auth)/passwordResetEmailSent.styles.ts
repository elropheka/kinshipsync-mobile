import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { Spacing } from 'constants/dimensions';

export const createPasswordResetEmailSentStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: Spacing.l,
    backgroundColor: theme.background,
  },
  emptyState: {
    marginBottom: Spacing.l,
  },
  button: {
    marginTop: Spacing.s,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createPasswordResetEmailSentStyles(Colors.light);
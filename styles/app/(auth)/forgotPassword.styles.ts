import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { BorderRadius, Spacing } from 'constants/dimensions';

export const createForgotPasswordStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.l,
    backgroundColor: theme.background,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: Spacing.m,
    padding: Spacing.xs,
  },
  title: {
    textAlign: 'left',
    marginBottom: Spacing.s,
  },
  subtitle: {
    textAlign: 'left',
    marginBottom: Spacing.l,
  },
  input: {
    marginBottom: Spacing.m,
  },
  button: {
    marginBottom: Spacing.m,
    borderRadius: BorderRadius.round,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  backLink: {
    textAlign: 'center',
    marginTop: Spacing.s,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createForgotPasswordStyles(Colors.light);
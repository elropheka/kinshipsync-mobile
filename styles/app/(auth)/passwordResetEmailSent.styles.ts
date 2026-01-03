import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/Colors';

export const createPasswordResetEmailSentStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: theme.backgroundLight,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.buttonPrimary,
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: theme.text,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    backgroundColor: theme.buttonPrimary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: theme.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createPasswordResetEmailSentStyles(Colors.light);
import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/Colors';

export const createForgotPasswordStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: theme.backgroundLight,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.buttonPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: theme.text,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    borderColor: theme.grey,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: theme.backgroundPaper,
    color: theme.text,
  },
  button: {
    backgroundColor: theme.buttonPrimary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: theme.grey,
  },
  buttonText: {
    color: theme.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  backLink: {
    fontSize: 16,
    color: theme.buttonPrimary,
    textAlign: 'center',
    marginTop: 10,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createForgotPasswordStyles(Colors.light);
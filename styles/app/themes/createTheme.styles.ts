import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export const createCreateThemeStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    contentContainer: {
      padding: 20,
    },
    label: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 6,
      marginTop: 10,
    },
    input: {
      backgroundColor: theme.backgroundPaper,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
      color: theme.text,
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.primary,
      marginTop: 20,
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
      paddingBottom: 5,
    },
    buttonContainer: {
      marginTop: 30,
      marginBottom: 20,
    },
  });

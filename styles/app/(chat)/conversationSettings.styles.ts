import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export const createConversationSettingsStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    placeholder: {
      marginTop: 20,
      fontStyle: 'italic',
      color: theme.textSecondary,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
      color: theme.text,
    },
    participantItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
      backgroundColor: theme.divider,
    },
    participantInfo: {
      flex: 1,
    },
    participantName: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.text,
    },
    participantRole: {
      fontSize: 14,
      color: theme.textSecondary,
      textTransform: 'capitalize',
    },
    manageRoleButton: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    errorText: {
      color: theme.error,
      textAlign: 'center',
    },
  });

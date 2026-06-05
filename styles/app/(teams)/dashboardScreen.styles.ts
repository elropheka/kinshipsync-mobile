import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export const createDashboardScreenStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundLight,
    },
    tabsContainer: {
      flexDirection: 'row',
      backgroundColor: theme.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    tab: {
      flex: 1,
      paddingVertical: 15,
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: 3,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: theme.primary,
    },
    tabText: {
      fontSize: 16,
      color: theme.textSecondary,
      fontWeight: '500',
    },
    activeTabText: {
      color: theme.primary,
    },
    listHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      padding: 15,
      backgroundColor: theme.backgroundPaper,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 15,
      backgroundColor: theme.background,
    },
    itemIcon: {
      marginRight: 15,
    },
    avatarImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 15,
      backgroundColor: theme.divider,
    },
    itemTextContainer: {
      flex: 1,
    },
    itemName: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.text,
    },
    itemSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 2,
    },
    separator: {
      height: 1,
      backgroundColor: theme.divider,
      marginLeft: 15 + 40 + 15,
    },
    emptyListText: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
      color: theme.textSecondary,
    },
  });

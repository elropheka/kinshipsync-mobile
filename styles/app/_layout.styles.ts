import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from 'constants/dimensions';

export const createResponsiveLayoutStyles = (isTablet: boolean, isLandscape: boolean) => {
  // const basePadding = isTablet ? 24 : 16;
  // const maxWidth = isTablet ? 1200 : '100%';
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.light?.background || '#FFFFFF',
    },
    content: {
      flex: 1,
      alignSelf: 'center',
      width: Layout.SCREEN_WIDTH,
    },
    header: {
      paddingVertical: isTablet ? 20 : 16,
      // paddingHorizontal: basePadding,
      borderBottomWidth: 1,
      borderBottomColor: Colors.light?.border || '#E5E5E5',
    },
    headerTitle: {
      fontSize: isTablet ? 28 : 24,
      fontWeight: '600',
      textAlign: isTablet ? 'left' : 'center',
    },
    section: {
      marginVertical: isTablet ? 20 : 16,
    },
    sectionTitle: {
      fontSize: isTablet ? 22 : 18,
      fontWeight: '600',
      marginBottom: isTablet ? 16 : 12,
    },
    card: {
      backgroundColor: Colors.light?.background || '#FFFFFF',
      borderRadius: 12,
      // padding: basePadding,
      marginBottom: 16,
      shadowColor: Colors.light?.divider || '#000000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    gridContainer: {
      flexDirection: isTablet && isLandscape ? 'row' : 'column',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    gridItem: {
      width: isTablet && isLandscape ? '48%' : '100%',
      marginBottom: 16,
    },
    button: {
      paddingVertical: isTablet ? 16 : 12,
      paddingHorizontal: isTablet ? 24 : 20,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      fontSize: isTablet ? 16 : 14,
      fontWeight: '600',
    },
    input: {
      borderWidth: 1,
      borderColor: Colors.light?.border || '#E5E5E5',
      borderRadius: 8,
      paddingVertical: isTablet ? 16 : 12,
      paddingHorizontal: isTablet ? 20 : 16,
      fontSize: isTablet ? 16 : 14,
      marginBottom: 16,
    },
    modal: {
      margin: isTablet ? 40 : 20,
      borderRadius: 12,
      backgroundColor: Colors.light?.background || '#FFFFFF',
      // padding: basePadding,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: isTablet ? 24 : 20,
      fontWeight: '600',
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: isTablet ? 16 : 12,
      // paddingHorizontal: basePadding,
      borderBottomWidth: 1,
      borderBottomColor: Colors.light?.border || '#E5E5E5',
    },
    listItemText: {
      flex: 1,
      fontSize: isTablet ? 16 : 14,
      marginLeft: 12,
    },
    avatar: {
      width: isTablet ? 48 : 40,
      height: isTablet ? 48 : 40,
      borderRadius: isTablet ? 24 : 20,
    },
    badge: {
      position: 'absolute',
      top: isTablet ? -4 : -2,
      right: isTablet ? -4 : -2,
      backgroundColor: Colors.light?.primary || '#007AFF',
      borderRadius: isTablet ? 8 : 6,
      minWidth: isTablet ? 16 : 12,
      height: isTablet ? 16 : 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: {
      color: Colors.light?.background || '#FFFFFF',
      fontSize: isTablet ? 10 : 8,
      fontWeight: '600',
    },
  });
};

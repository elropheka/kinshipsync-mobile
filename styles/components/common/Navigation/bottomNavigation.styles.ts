import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';
import {
  Layout,
  Spacing,
  BorderRadius,
  ResponsiveFontSizes,
} from 'constants/dimensions';
import Fonts from 'constants/fonts';

export const createBottomNavigationStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: theme.tabBarBackground,
      height: Layout.SCREEN_HEIGHT * 0.09,
      paddingBottom: Spacing.s,
      paddingTop: Spacing.xs,
      borderTopLeftRadius: BorderRadius.xl,
      borderTopRightRadius: BorderRadius.xl,
      zIndex: 10,
    },
    tabButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing.xs,
    },
    activeTabButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing.xs,
    },
    tabLabel: {
      fontSize: ResponsiveFontSizes.caption,
      fontFamily: Fonts.bodyMedium,
      marginTop: Spacing.xxs,
      color: theme.tabBarIcon,
    },
    activeTabLabel: {
      color: theme.tabBarIconActive,
      fontFamily: Fonts.buttonBold,
    },
    menuBackdrop: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      zIndex: 15,
    },
    addMenuContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.backgroundPaper,
      borderTopLeftRadius: BorderRadius.l,
      borderTopRightRadius: BorderRadius.l,
      paddingVertical: Spacing.m,
      paddingBottom: Spacing.xl,
      paddingHorizontal: Spacing.l,
      elevation: 10,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      zIndex: 20,
    },
    addMenuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.m,
      paddingHorizontal: Spacing.m,
    },
    addMenuItemIcon: {
      marginRight: Spacing.m,
    },
    addMenuItemText: {
      fontSize: ResponsiveFontSizes.title,
      fontFamily: Fonts.bodyMedium,
      color: theme.text,
    },
    menuDivider: {
      height: 1,
      backgroundColor: theme.border,
      marginHorizontal: Spacing.m,
    },
  });

export const styles = createBottomNavigationStyles(Colors.light);

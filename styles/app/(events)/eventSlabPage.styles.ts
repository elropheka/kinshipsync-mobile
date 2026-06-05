import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing, moderateScale, ResponsiveFontSizes } from '@/constants/dimensions';

export const createEventSlabPageStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor: theme.background,
    },
    slab: {
      backgroundColor: theme.backgroundPaper,
      borderWidth: 1,
      borderColor: theme.buttonPrimary,
      borderRadius: BorderRadius.m,
      paddingVertical: Spacing.m,
      paddingHorizontal: Spacing.m,
    },
    taskSlab: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    listContent: {
      paddingHorizontal: Spacing.m,
      paddingTop: Spacing.m,
      paddingBottom: Spacing.xxl + Spacing.xxl,
      flexGrow: 1,
    },
    slabGap: {
      height: Spacing.m,
    },
    fab: {
      position: 'absolute',
      right: Spacing.l,
      bottom: Spacing.l,
      backgroundColor: theme.primary,
      width: moderateScale(56),
      height: moderateScale(56),
      borderRadius: moderateScale(28),
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 8,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: Spacing.xxl,
      minHeight: moderateScale(200),
    },
    emptyText: {
      textAlign: 'center',
      color: theme.textSecondary,
      fontSize: ResponsiveFontSizes.body,
      paddingHorizontal: Spacing.l,
    },
    memberCount: {
      fontSize: ResponsiveFontSizes.caption,
      color: theme.textSecondary,
      marginTop: Spacing.xxs,
    },
  });

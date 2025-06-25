import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import {
  Spacing,
  BorderRadius,
  ResponsiveFontSizes,
  IconSizes,
} from 'constants/dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.m,
    backgroundColor: Colors.light.background,
  },
  headerContainer: {
    marginTop: Spacing.l,
    paddingHorizontal: Spacing.l,
    alignItems: 'center',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  timeText: {
    fontWeight: Fonts.weights.bold,
    fontSize: ResponsiveFontSizes.subtitle,
    color: Colors.light.text,
  },
  statusIcons: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  signalIcon: {
    fontSize: IconSizes.s,
    color: Colors.light.icon,
  },
  wifiIcon: {
    fontSize: IconSizes.s,
    color: Colors.light.icon,
  },
  batteryIcon: {
    fontSize: IconSizes.s,
    color: Colors.light.icon,
  },
  pageTitle: {
    fontSize: ResponsiveFontSizes.header1,
    fontWeight: Fonts.weights.bold,
    marginBottom: Spacing.m,
    color: Colors.light.text,
  },
  description: {
    fontSize: ResponsiveFontSizes.subtitle,
    lineHeight: ResponsiveFontSizes.subtitle * 1.375,
    marginBottom: Spacing.xxl,
    color: Colors.light.text,
    textAlign: 'center',
  },
  actionButtonsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: Spacing.m,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.l,
    borderRadius: BorderRadius.m,
    minWidth: '80%',
    shadowColor: Colors.light.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84, // Consider moderateScale or a new constant
    elevation: 5,
  },
  actionButtonIcon: {
    fontSize: IconSizes.m,
    marginRight: Spacing.s,
  },
  actionButtonText: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
    color: Colors.light.text,
                                  // If button bg is light, text should be dark. If button bg is dark, text should be light.
                                  // For now, using default text color. This might need adjustment based on specific button bg.
  },
  venueButton: {
    backgroundColor: '#ffa726', // Orange - Consider adding to Colors.ts if widely used
                                  // e.g., Colors.custom.orangeAccent
  },
  guestButton: {
    backgroundColor: '#b39ddb', // Purple - Consider adding to Colors.ts
                                  // e.g., Colors.custom.purpleAccent
    transform: [{ rotate: '-5deg' }],
  },
  bandButton: {
    backgroundColor: '#ffa726', // Orange
  },
  vendorButton: {
    backgroundColor: '#b39ddb', // Purple
  },
  rsvpButton: {
    backgroundColor: '#80deea', // Teal - Consider adding to Colors.ts
                                  // e.g., Colors.custom.tealAccent
    transform: [{ rotate: '-3deg' }],
  },
});

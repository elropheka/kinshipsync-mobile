import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import {
  Spacing,
  BorderRadius,
  ResponsiveFontSizes,
  moderateScale,
} from 'constants/dimensions';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.dark.background + 'BF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: moderateScale(400),
    backgroundColor: Colors.light.backgroundPaper,
    borderRadius: BorderRadius.m,
    padding: Spacing.l,
    alignItems: 'center',
    shadowColor: Colors.light.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: moderateScale(4),
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.s,
    right: Spacing.s,
    padding: Spacing.xs,
    zIndex: 1,
  },
  adTitle: {
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.m,
    alignSelf: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
    width: '100%',
    paddingBottom: Spacing.xs,
  },
  adBody: {
    marginVertical: Spacing.l,
    alignItems: 'center',
    minHeight: moderateScale(100),
  },
  adText: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.bold,
    textAlign: 'center',
    color: Colors.light.text,
    marginBottom: Spacing.s,
  },
  adTextSmall: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  closingText: {
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.textSecondary,
    marginTop: Spacing.m,
  },
});

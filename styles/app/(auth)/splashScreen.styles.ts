import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import {
  Spacing,
  ResponsiveFontSizes,
  moderateScale,
} from 'constants/dimensions';

export const createSplashScreenStyles = (theme: typeof Colors.light) => StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
  },
  logoViewContainer: {
    width: moderateScale(280),
    height: moderateScale(120),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  spinner: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.s,
  },
  title: {
    fontSize: ResponsiveFontSizes.header2,
    fontWeight: Fonts.weights.bold,
    color: theme.text,
    fontFamily: Fonts.headerBold,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createSplashScreenStyles(Colors.light);
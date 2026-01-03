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
    backgroundColor: theme.backgroundPrimary,
  },
  logoViewContainer: {
    width: moderateScale(1200),
    height: moderateScale(300),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '50%',
    aspectRatio: 1, 
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
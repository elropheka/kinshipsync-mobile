import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import {
  Spacing,
  ResponsiveFontSizes,
  moderateScale,
} from 'constants/dimensions';

export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundPrimary,
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
    color: Colors.light.text,
    fontFamily: Fonts.headerBold,
  },
});

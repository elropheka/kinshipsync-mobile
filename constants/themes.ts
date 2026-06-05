import { Theme, FontSettings } from '../types/eventTypes';
import { Colors } from './Colors';
import Fonts from './fonts';
import { brandColors } from './brandTokens';

const defaultFontSettings: FontSettings = {
  fontFamily: Fonts.bodyRegular,
  fontWeight: '400',
  fontStyle: 'normal',
};

const defaultHeadingFontSettings: FontSettings = {
  fontFamily: Fonts.headerMedium,
  fontWeight: '500',
  fontStyle: 'normal',
};

export const predefinedThemes: Theme[] = [
  {
    id: 'predefined-wedding',
    name: 'Elegant Wedding',
    isPredefined: true,
    colors: {
      primary: brandColors.heritageGreen,
      secondary: brandColors.sand,
      accent: brandColors.golden,
      background: brandColors.cream,
      text: brandColors.rust,
      cardBackground: '#FFFFFF',
      borderColor: brandColors.sand,
    },
    fonts: {
      heading: { fontFamily: Fonts.headerMedium, fontWeight: '500', fontStyle: 'normal' },
      body: { fontFamily: Fonts.bodyRegular, fontWeight: '400', fontStyle: 'normal' },
    },
  },
  {
    id: 'predefined-birthday',
    name: 'Vibrant Birthday Party',
    isPredefined: true,
    colors: {
      primary: brandColors.heritageGreen,
      secondary: brandColors.sand,
      accent: brandColors.orange,
      background: brandColors.cream,
      text: brandColors.rust,
      cardBackground: Colors.light.backgroundPaper,
      borderColor: Colors.light.border,
    },
    fonts: {
      heading: { fontFamily: Fonts.headerBold, fontWeight: '700', fontStyle: 'normal' },
      body: { fontFamily: Fonts.bodyRegular, fontWeight: '400', fontStyle: 'normal' },
    },
  },
  {
    id: 'predefined-reunion',
    name: 'Warm Reunion',
    isPredefined: true,
    colors: {
      primary: brandColors.heritageGreen,
      secondary: brandColors.sand,
      accent: brandColors.orange,
      background: brandColors.cream,
      text: brandColors.rust,
      cardBackground: Colors.light.backgroundPaper,
      borderColor: brandColors.sand,
    },
    fonts: {
      heading: { fontFamily: Fonts.headerSemiBold, fontWeight: '600', fontStyle: 'normal' },
      body: { fontFamily: Fonts.bodyMedium, fontWeight: '500', fontStyle: 'normal' },
    },
  },
  {
    id: 'predefined-baby-shower',
    name: 'Sweet Baby Shower',
    isPredefined: true,
    colors: {
      primary: brandColors.heritageGreen,
      secondary: brandColors.sand,
      accent: brandColors.golden,
      background: brandColors.cream,
      text: brandColors.rust,
      cardBackground: Colors.light.backgroundPaper,
      borderColor: brandColors.sand,
    },
    fonts: {
      heading: { fontFamily: Fonts.headerMedium, fontWeight: '500', fontStyle: 'normal' },
      body: { fontFamily: Fonts.bodyRegular, fontWeight: '400', fontStyle: 'normal' },
    },
  },
];

export const getDefaultTheme = (): Theme => {
  return predefinedThemes.length > 0 ? predefinedThemes[0] : {
    id: 'default-fallback',
    name: 'Default Fallback',
    isPredefined: true,
    colors: {
      primary: Colors.light.buttonPrimary,
      secondary: Colors.light.accent,
      accent: Colors.light.accentHighlight,
      background: Colors.light.background,
      text: Colors.light.text,
      cardBackground: Colors.light.backgroundPaper,
      borderColor: Colors.light.border,
    },
    fonts: {
      heading: defaultHeadingFontSettings,
      body: defaultFontSettings,
    },
  };
};

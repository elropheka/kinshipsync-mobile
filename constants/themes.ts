import { Theme, FontSettings } from '../types/eventTypes';
import { Colors } from './Colors';
import Fonts from './fonts';

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
      primary: '#D4AF37',
      secondary: '#F5F5DC',
      accent: '#E6E6FA',
      background: '#FFFAFA',
      text: '#36454F',
      cardBackground: '#FFFFFF',
      borderColor: '#DCDCDC',
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
      primary: Colors.light.buttonPrimary,
      secondary: '#FFD700',
      accent: '#FF69B4',
      background: '#FFFFFF',
      text: Colors.light.text,
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
      primary: '#800000',
      secondary: '#D2B48C',
      accent: '#FF8C00',
      background: '#FAF0E6',
      text: '#2F4F4F',
      cardBackground: '#FFF5EE',
      borderColor: '#BDB76B',
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
      primary: '#ADD8E6',
      secondary: '#FFFACD',
      accent: '#98FB98',
      background: '#FFFFFF',
      text: '#778899',
      cardBackground: '#FAFAD2',
      borderColor: '#D3D3D3',
    },
    fonts: {
      heading: { fontFamily: Fonts.headerMedium, fontWeight: '500', fontStyle: 'normal' },
      body: { fontFamily: Fonts.bodyLight, fontWeight: '300', fontStyle: 'normal' },
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

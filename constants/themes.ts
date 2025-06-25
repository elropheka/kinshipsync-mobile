import { Theme, FontSettings } from '../types/eventTypes';
import { Colors } from './Colors'; // Assuming Colors might be used, or specific hex codes
import Fonts from './fonts'; // To access font names

const defaultFontSettings: FontSettings = {
  fontFamily: Fonts.bodyRegular, // Default body font
  fontWeight: '400',
  fontStyle: 'normal',
};

const defaultHeadingFontSettings: FontSettings = {
  fontFamily: Fonts.headerMedium, // Default heading font
  fontWeight: '500', // Medium weight
  fontStyle: 'normal',
};

export const predefinedThemes: Theme[] = [
  {
    id: 'predefined-wedding',
    name: 'Elegant Wedding',
    isPredefined: true,
    colors: {
      primary: '#D4AF37', // Gold
      secondary: '#F5F5DC', // Beige/Cream
      accent: '#E6E6FA', // Lavender
      background: '#FFFAFA', // Snow White
      text: '#36454F', // Charcoal
      cardBackground: '#FFFFFF',
      borderColor: '#DCDCDC', // Gainsboro
    },
    fonts: {
      heading: { fontFamily: Fonts.headerMedium, fontWeight: '500' }, // Poppins-Medium
      body: { fontFamily: Fonts.bodyRegular, fontWeight: '400' },    // Poppins-Regular
    },
  },
  {
    id: 'predefined-birthday',
    name: 'Vibrant Birthday Party',
    isPredefined: true,
    colors: {
      primary: Colors.light.buttonPrimary, // '#0a7ea4' (Teal)
      secondary: '#FFD700', // Gold/Yellow
      accent: '#FF69B4', // Hot Pink
      background: '#FFFFFF', // White
      text: Colors.light.text, // '#11181C'
      cardBackground: Colors.light.backgroundPaper, // '#F5F5F5'
      borderColor: Colors.light.border, // '#D1D5DB'
    },
    fonts: {
      heading: { fontFamily: Fonts.headerBold, fontWeight: '700' },   // Poppins-Bold
      body: { fontFamily: Fonts.bodyRegular, fontWeight: '400' },  // Poppins-Regular
    },
  },
  {
    id: 'predefined-reunion',
    name: 'Warm Reunion',
    isPredefined: true,
    colors: {
      primary: '#800000', // Maroon
      secondary: '#D2B48C', // Tan
      accent: '#FF8C00', // Dark Orange
      background: '#FAF0E6', // Linen
      text: '#2F4F4F', // Dark Slate Gray
      cardBackground: '#FFF5EE', // Seashell
      borderColor: '#BDB76B', // Dark Khaki
    },
    fonts: {
      heading: { fontFamily: Fonts.headerSemiBold, fontWeight: '600' }, // Poppins-SemiBold
      body: { fontFamily: Fonts.bodyMedium, fontWeight: '500' },      // Poppins-Medium
    },
  },
  {
    id: 'predefined-baby-shower',
    name: 'Sweet Baby Shower',
    isPredefined: true,
    colors: {
      primary: '#ADD8E6', // Light Blue
      secondary: '#FFFACD', // Lemon Chiffon (Pale Yellow)
      accent: '#98FB98', // Pale Green
      background: '#FFFFFF', // White
      text: '#778899', // Light Slate Gray
      cardBackground: '#FAFAD2', // Light Goldenrod Yellow
      borderColor: '#D3D3D3', // Light Gray
    },
    fonts: {
      heading: { fontFamily: Fonts.headerMedium, fontWeight: '500' }, // Poppins-Medium
      body: { fontFamily: Fonts.bodyLight, fontWeight: '300' },      // Poppins-Light
    },
  },
];

export const getDefaultTheme = (): Theme => {
  // Returns the first predefined theme or a very basic default if array is empty
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

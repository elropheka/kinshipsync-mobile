import { brandColors } from './brandTokens';

const cream = brandColors.cream;
const heritageGreen = brandColors.heritageGreen;
const orange = brandColors.orange;
const sand = brandColors.sand;
const rust = brandColors.rust;
const golden = brandColors.golden;

// Legacy names kept for compatibility with existing code.
// Historically the app used teal/brown; we now map those to warm brand colors.
const brown = rust;
const darkBrown = '#7B4E2D'; // deeper rust-brown for dark UI accents

export const Colors = {
  brown: brown,
  darkBrown: darkBrown,
  light: {
    text: rust,
    textSecondary: heritageGreen,
    textMuted: '#7A7A7A',
    textLight: '#FFFFFF',
    textDarkContrast: heritageGreen,

    background: cream,
    backgroundPrimary: '#FFF8F0',
    backgroundSecondary: sand,
    backgroundLight: '#FFFFFF',
    backgroundPaper: '#FFFFFF',
    neutralBg: '#FFF5EC',
    buttonPrimary: heritageGreen,

    primary: heritageGreen,
    primaryContrastText: '#FFFFFF',
    accent: orange,
    accentContrastText: '#FFFFFF',
    accentHighlight: golden,

    tint: heritageGreen,
    icon: sand,
    tabIconDefault: sand,
    tabIconSelected: heritageGreen,
    border: sand,
    divider: '#EDE0CE',

    success: '#4CAF50',
    successContrastText: '#FFFFFF',
    error: '#F44336',
    danger: '#D32F2F',
    errorContrastText: '#FFFFFF',
    warning: '#FFC107',
    warningContrastText: '#11181C',
    info: '#2196F3',
    infoContrastText: '#FFFFFF',

    primaryLight: '#D6C8AF',
    successLight: '#E8F5E9',
    warningLight: '#FFF8E1',
    infoLight: '#E3F2FD',
    errorLight: '#FFEBEE',
    dangerLight: '#FFCDD2',
    secondary: rust,
    secondaryLight: '#D8BFA6',
    tertiary: orange,
    tertiaryContrastText: '#FFFFFF',
    tertiaryLight: '#FFE0B2',
    grey: '#B0BEC5',
    tabBarBackground: rust,
    tabBarIcon: '#FFFFFF',
    tabBarIconActive: heritageGreen,
  },
  dark: {
    text: cream,
    textSecondary: sand,
    textMuted: sand,
    textLight: '#FFFFFF',
    textDarkContrast: heritageGreen,

    background: '#1A1410',
    backgroundPrimary: '#241A16',
    backgroundSecondary: '#2A221C',
    backgroundLight: '#17110E',
    backgroundPaper: '#211815',
    neutralBg: '#2B221D',
    buttonPrimary: heritageGreen,

    primary: heritageGreen,
    primaryContrastText: '#FFFFFF',
    accent: orange,
    accentContrastText: '#FFFFFF',
    accentHighlight: golden,

    tint: heritageGreen,
    icon: sand,
    tabIconDefault: sand,
    tabIconSelected: heritageGreen,
    border: '#3A2B22',
    divider: '#2A221C',

    success: '#4CAF50',
    successContrastText: '#FFFFFF',
    error: '#EF5350',
    danger: '#E57373',
    errorContrastText: '#121212',
    warning: '#FFC107',
    warningContrastText: '#121212',
    info: '#2196F3',
    infoContrastText: '#FFFFFF',

    primaryLight: '#4DB6AC',
    successLight: '#E8F5E9',
    warningLight: '#FFF8E1',
    infoLight: '#E3F2FD',
    errorLight: '#FFEBEE',
    dangerLight: '#FFCDD2',
    secondary: darkBrown,
    secondaryLight: '#D8BFA6',
    tertiary: orange,
    tertiaryContrastText: '#FFFFFF',
    tertiaryLight: '#FFE0B2',
    grey: '#B0BEC5',
    tabBarBackground: rust,
    tabBarIcon: '#FFFFFF',
    tabBarIconActive: golden,
  },
};

export type ColorPalette = (typeof Colors)['light'];

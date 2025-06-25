export interface ColorPalette {
  // Core Interactive & Brand Colors
  primary: string;
  primaryContrastText: string;
  secondary: string;
  secondaryContrastText: string;
  accent: string;
  accentContrastText: string;

  // Backgrounds & Surfaces
  background: string;
  surface: string; // For cards, modals, sidebars, etc.

  // Text & Borders
  textOnBackground: string; // Primary text on main background
  textOnSurface: string;    // Primary text on surface backgrounds
  textSecondary: string;    // For less important text, subheadings
  border: string;           // For borders and dividers

  // Semantic/Status Colors
  success: string;
  successContrastText: string;
  error: string;
  errorContrastText: string;
  warning: string;
  warningContrastText: string;
  info: string;
  infoContrastText: string;

  // States
  disabledBackground: string; // Background for disabled interactive elements
  disabledText: string;       // Text color for disabled interactive elements
}

export const standardLightPalette: ColorPalette = {
  primary: '#007bff',
  primaryContrastText: '#FFFFFF',
  secondary: '#6c757d',
  secondaryContrastText: '#FFFFFF',
  accent: '#17a2b8',
  accentContrastText: '#FFFFFF',
  background: '#ffffff',
  surface: '#f8f9fa',
  textOnBackground: '#212529',
  textOnSurface: '#212529',
  textSecondary: '#6c757d',
  border: '#dee2e6',
  success: '#4CAF50',
  successContrastText: '#FFFFFF',
  error: '#F44336',
  errorContrastText: '#FFFFFF',
  warning: '#FFC107',
  warningContrastText: '#212529',
  info: '#2196F3',
  infoContrastText: '#FFFFFF',
  disabledBackground: '#e9ecef',
  disabledText: '#adb5bd',
};

export const standardDarkPalette: ColorPalette = {
  primary: '#0d6efd',
  primaryContrastText: '#FFFFFF',
  secondary: '#adb5bd',
  secondaryContrastText: '#121212',
  accent: '#0dcaf0',
  accentContrastText: '#121212',
  background: '#121212',
  surface: '#1c1c1c',
  textOnBackground: '#e9ecef',
  textOnSurface: '#e9ecef',
  textSecondary: '#adb5bd',
  border: '#495057',
  success: '#66BB6A',
  successContrastText: '#121212',
  error: '#EF5350',
  errorContrastText: '#121212',
  warning: '#FFEE58',
  warningContrastText: '#121212',
  info: '#42A5F5',
  infoContrastText: '#121212',
  disabledBackground: '#343a40',
  disabledText: '#6c757d',
};

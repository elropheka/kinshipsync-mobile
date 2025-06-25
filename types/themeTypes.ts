export interface ThemeColors {
  primary: string;
  secondary: string;
  accent?: string;
  background: string;
  backgroundSecondary?: string;
  text: string;
  textMuted?: string;
  border?: string;
  primaryContrastText?: string;
  white: string;
  black: string;
}

export interface FontSettings {
  fontFamily: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  fontStyle?: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
  fonts: {
    heading: FontSettings;
    body: FontSettings;
  };
  isPredefined?: boolean;
}

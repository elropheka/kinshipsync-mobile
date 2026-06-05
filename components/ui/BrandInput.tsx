import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { useAppTheme } from '@/context/AppThemeContext';
import { Colors } from '@/constants/Colors';
import Fonts from '@/constants/fonts';
import { BorderRadius, Spacing } from '@/constants/dimensions';

type BrandInputProps = TextInputProps;

export class BrandInput extends React.Component<BrandInputProps> {
  public render(): React.ReactNode {
    return <BrandInputInner {...this.props} />;
  }
}

const BrandInputInner: React.FC<BrandInputProps> = ({ style, ...rest }) => {
  const { currentColors } = useAppTheme();
  const styles = createStyles(currentColors);

  return (
    <TextInput
      placeholderTextColor={currentColors.textSecondary}
      style={[styles.input, style]}
      {...rest}
    />
  );
};

const createStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    input: {
      minHeight: 48,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: BorderRadius.l,
      paddingHorizontal: Spacing.m,
      paddingVertical: Spacing.s,
      fontFamily: Fonts.bodyRegular,
      fontSize: 16,
      color: theme.text,
      backgroundColor: theme.backgroundPaper,
    },
  });

export default BrandInput;

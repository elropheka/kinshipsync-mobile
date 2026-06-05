import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/context/AppThemeContext';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Layout, Spacing } from '@/constants/dimensions';
import Fonts from '@/constants/fonts';

interface BrandSearchBarProps extends TextInputProps {
  containerStyle?: object;
}

export class BrandSearchBar extends React.Component<BrandSearchBarProps> {
  public render(): React.ReactNode {
    return <BrandSearchBarInner {...this.props} />;
  }
}

const BrandSearchBarInner: React.FC<BrandSearchBarProps> = ({
  containerStyle,
  style,
  placeholder = 'Search',
  ...rest
}) => {
  const { currentColors } = useAppTheme();
  const styles = createStyles(currentColors);

  return (
    <View style={[styles.container, containerStyle]}>
      <Ionicons name="search" size={18} color={currentColors.textSecondary} style={styles.icon} />
      <TextInput
        style={[styles.input, style]}
        placeholder={placeholder}
        placeholderTextColor={currentColors.textSecondary}
        {...rest}
      />
    </View>
  );
};

const createStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.backgroundSecondary,
      marginHorizontal: Spacing.l,
      marginVertical: Spacing.m,
      paddingHorizontal: Spacing.m,
      borderRadius: BorderRadius.xl,
      height: Layout.inputHeight,
      borderWidth: 1,
      borderColor: theme.border,
    },
    icon: {
      marginRight: Spacing.s,
    },
    input: {
      flex: 1,
      fontFamily: Fonts.bodyRegular,
      fontSize: 16,
      color: theme.text,
    },
  });

export default BrandSearchBar;

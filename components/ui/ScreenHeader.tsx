import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View, ViewProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/context/AppThemeContext';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/dimensions';
import { BrandText } from './BrandText';

interface ScreenHeaderProps extends ViewProps {
  title?: string;
  showLogo?: boolean;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  notificationCount?: number;
}

export class ScreenHeader extends React.Component<ScreenHeaderProps> {
  public render(): React.ReactNode {
    return <ScreenHeaderInner {...this.props} />;
  }
}

const ScreenHeaderInner: React.FC<ScreenHeaderProps> = ({
  title,
  showLogo = true,
  onMenuPress,
  onNotificationPress,
  notificationCount = 0,
  style,
  ...rest
}) => {
  const { currentColors } = useAppTheme();
  const styles = createStyles(currentColors);

  return (
    <View style={[styles.container, style]} {...rest}>
      <View style={styles.left}>
        {showLogo ? (
          <Image
            source={require('@/assets/branding/rusty-brown-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        ) : title ? (
          <BrandText variant="h3">{title}</BrandText>
        ) : null}
      </View>
      <View style={styles.actions}>
        {onNotificationPress ? (
          <TouchableOpacity onPress={onNotificationPress} style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color={currentColors.text} />
            {notificationCount > 0 ? <View style={styles.badge} /> : null}
          </TouchableOpacity>
        ) : null}
        {onMenuPress ? (
          <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
            <Ionicons name="menu-outline" size={24} color={currentColors.text} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const createStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: Spacing.m,
    },
    left: {
      flex: 1,
      alignItems: 'flex-start',
    },
    logo: {
      width: 140,
      height: 36,
      marginLeft: -Spacing.xs,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.s,
    },
    iconButton: {
      padding: Spacing.xs,
    },
    badge: {
      position: 'absolute',
      top: 4,
      right: 4,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.error,
    },
  });

export default ScreenHeader;

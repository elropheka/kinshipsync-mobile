import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewProps } from 'react-native';
import { BrandText } from './BrandText';
import { Spacing } from '@/constants/dimensions';

interface BrandSectionHeaderProps extends ViewProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export class BrandSectionHeader extends React.Component<BrandSectionHeaderProps> {
  public render(): React.ReactNode {
    return <BrandSectionHeaderInner {...this.props} />;
  }
}

const BrandSectionHeaderInner: React.FC<BrandSectionHeaderProps> = ({
  title,
  actionLabel,
  onActionPress,
  style,
  ...rest
}) => (
  <View style={[styles.container, style]} {...rest}>
    <BrandText variant="h4">{title}</BrandText>
    {actionLabel && onActionPress ? (
      <TouchableOpacity onPress={onActionPress}>
        <BrandText variant="body" color="secondary">
          {actionLabel}
        </BrandText>
      </TouchableOpacity>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
});

export default BrandSectionHeader;

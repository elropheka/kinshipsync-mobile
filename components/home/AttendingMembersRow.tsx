import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/context/AppThemeContext';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/dimensions';
import { BrandText } from '@/components/ui/BrandText';
import { Avatar } from '@/components/common/Avatar';
import type { HomeDashboardMember } from '@/hooks/useHomeDashboard';

interface AttendingMembersRowProps {
  members: HomeDashboardMember[];
  maxVisible?: number;
}

export class AttendingMembersRow extends React.Component<AttendingMembersRowProps> {
  public render(): React.ReactNode {
    return <AttendingMembersRowInner {...this.props} />;
  }
}

const AttendingMembersRowInner: React.FC<AttendingMembersRowProps> = ({
  members,
  maxVisible = 4,
}) => {
  const { currentColors } = useAppTheme();
  const styles = createStyles(currentColors);

  if (members.length === 0) {
    return null;
  }

  const visible = members.slice(0, maxVisible);
  const overflow = Math.max(members.length - maxVisible, 0);

  return (
    <View style={styles.section}>
      <BrandText variant="h4" style={styles.title}>
        Attending Members
      </BrandText>
      <View style={styles.row}>
        {visible.map((member, index) => (
          <View key={member.id} style={[styles.avatarWrap, index > 0 && styles.overlap]}>
            <Avatar name={member.name} size={44} avatarUrl={member.avatarUrl} />
          </View>
        ))}
        {overflow > 0 ? (
          <View style={[styles.moreBadge, styles.overlap]}>
            <BrandText variant="caption" color="light">
              +{overflow}
            </BrandText>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const createStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    section: {
      marginBottom: Spacing.l,
    },
    title: {
      marginBottom: Spacing.s,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatarWrap: {
      borderWidth: 2,
      borderColor: theme.background,
      borderRadius: BorderRadius.round,
    },
    overlap: {
      marginLeft: -Spacing.s,
    },
    moreBadge: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.background,
    },
  });

export default AttendingMembersRow;

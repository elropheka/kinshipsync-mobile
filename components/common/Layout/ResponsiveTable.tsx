import React from 'react';
import { View, Text, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface Column {
  key: string;
  title: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
}

interface ResponsiveTableProps {
  columns: Column[];
  data: any[];
  style?: ViewStyle;
  onRowPress?: (item: any) => void;
  emptyMessage?: string;
}

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  columns,
  data,
  style,
  onRowPress,
  emptyMessage = 'No data available',
}) => {
  const { isTablet, screenWidth } = useResponsiveLayout();

  // Use table layout for tablets, card layout for phones
  const useTableLayout = isTablet && screenWidth >= 768;

  if (useTableLayout) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={[styles.tableContainer, style]}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            {columns.map((column) => (
              <View
                key={column.key}
                style={[
                  styles.tableHeaderCell,
                  column.width ? { width: column.width as any } : {},
                ]}
              >
                <Text style={[
                  styles.tableHeaderText,
                  { textAlign: column.align || 'left' }
                ]}>
                  {column.title}
                </Text>
              </View>
            ))}
          </View>

          {/* Table Rows */}
          {data.map((row, rowIndex) => (
            <View
              key={rowIndex}
              style={[
                styles.tableRow,
                rowIndex % 2 === 0 && styles.tableRowEven,
                onRowPress && styles.tableRowPressable,
              ]}
              onTouchEnd={() => onRowPress?.(row)}
            >
              {columns.map((column) => (
                <View
                  key={column.key}
                  style={[
                    styles.tableCell,
                    column.width ? { width: column.width as any } : {},
                  ]}
                >
                  <Text style={[
                    styles.tableCellText,
                    { textAlign: column.align || 'left' }
                  ]}>
                    {row[column.key] || '-'}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  // Card layout for phones
  return (
    <View style={[styles.cardContainer, style]}>
      {data.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      ) : (
        data.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={[
              styles.card,
              rowIndex % 2 === 0 && styles.cardEven,
              onRowPress && styles.cardPressable,
            ]}
            onTouchEnd={() => onRowPress?.(row)}
          >
            {columns.map((column) => (
              <View key={column.key} style={styles.cardField}>
                <Text style={styles.cardFieldLabel}>{column.title}</Text>
                <Text style={styles.cardFieldValue}>
                  {row[column.key] || '-'}
                </Text>
              </View>
            ))}
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tableHeaderCell: {
    padding: 16,
    minWidth: 120,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  tableRowEven: {
    backgroundColor: '#F8F9FA',
  },
  tableRowPressable: {
    cursor: 'pointer',
  },
  tableCell: {
    padding: 16,
    minWidth: 120,
  },
  tableCellText: {
    fontSize: 14,
    color: '#212529',
  },
  cardContainer: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardEven: {
    backgroundColor: '#F8F9FA',
  },
  cardPressable: {
    cursor: 'pointer',
  },
  cardField: {
    marginBottom: 12,
  },
  cardFieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C757D',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  cardFieldValue: {
    fontSize: 16,
    color: '#212529',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
  },
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

import { PlatformCard } from '../ui/card';

interface Props {
  categoryCount: number;
  reminderCount: number;
}

export default function CategorySummary({
  categoryCount,
  reminderCount,
}: Props) {
  const { colors } = useTheme();

  return (
    <PlatformCard style={styles.card}>
      <Text style={[styles.title, { color: colors.text }]}>
        Category overview
      </Text>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>
          Total categories
        </Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {categoryCount}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>
          Total reminders
        </Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {reminderCount}
        </Text>
      </View>
    </PlatformCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 15,
    marginTop: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 13,
    opacity: 0.65,
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
  },
});
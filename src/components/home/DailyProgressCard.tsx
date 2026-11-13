import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { PlatformCard } from '../ui/card';

interface Props {
  completed: number;
  total: number;
}

export default function DailyProgressCard({ completed, total }: Props) {
  const { colors } = useTheme();

  const progress = total > 0 ? completed / total : 0;
  const percentage = Math.round(progress * 100);

  return (
    <PlatformCard style={styles.card}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Today's progress
        </Text>

        <Text style={[styles.percentage, { color: colors.primary }]}>
          {percentage}%
        </Text>
      </View>

      <View style={[styles.track, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: colors.primary,
            },
          ]}
        />
      </View>

      <Text style={[styles.description, { color: colors.text }]}>
        {completed} of {total} reminders completed
      </Text>
    </PlatformCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  percentage: {
    fontSize: 16,
    fontWeight: '700',
  },
  track: {
    height: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  fill: {
    height: 8,
    borderRadius: 10,
  },
  description: {
    fontSize: 12,
    opacity: 0.65,
  },
});
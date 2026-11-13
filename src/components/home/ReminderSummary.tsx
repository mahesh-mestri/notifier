import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { PlatformCard } from '../ui/card';

interface Props {
  total: number;
  completed: number;
}

export default function ReminderSummary({ total, completed }: Props) {
  const { colors } = useTheme();

  const items = [
    { label: "Today's reminders", value: total, icon: '🔔' },
    { label: 'Completed', value: completed, icon: '✓' },
  ];

  return (
    <View style={styles.container}>
      {items.map(item => (
        <PlatformCard key={item.label} style={styles.card}>
          <Text style={styles.icon}>{item.icon}</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {item.value.toString().padStart(2, '0')}
          </Text>
          <Text style={[styles.label, { color: colors.text }]}>
            {item.label}
          </Text>
        </PlatformCard>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    gap: 8,
  },
  icon: {
    fontSize: 20,
  },
  value: {
    fontSize: 26,
    fontWeight: '700',
  },
  label: {
    fontSize: 12,
    opacity: 0.65,
  },
});
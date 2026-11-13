import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';

import { PlatformCard } from '../ui/card';
import type { Reminder } from '../../types/reminder.types';

interface Props {
  reminder: Reminder;
  onPress: () => void;
}

const categoryInfo: Record<string, { icon: string; color: string }> = {
  health: { icon: 'heart-pulse', color: '#16A34A' },
  work: { icon: 'briefcase', color: '#2563EB' },
  personal: { icon: 'account', color: '#9333EA' },
  other: { icon: 'dots-horizontal', color: '#EA580C' },
};

export default function ReminderItem({ reminder, onPress }: Props) {
  const { colors } = useTheme();
  const category = categoryInfo[reminder.categoryId];

  const time = new Date(reminder.scheduledAt).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <Pressable onPress={onPress}>
      <PlatformCard style={styles.card}>
        <View style={styles.row}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: category.color + '18' },
            ]}
          >
            <MaterialDesignIcons
              name={category.icon as any}
              size={23}
              color={category.color}
            />
          </View>

          <View style={styles.details}>
            <Text style={[styles.title, { color: colors.text }]}>
              {reminder.title}
            </Text>

            <Text style={[styles.subtitle, { color: colors.text }]}>
              {reminder.categoryId} · {time}
            </Text>

            {reminder.description ? (
              <Text style={[styles.description, { color: colors.text }]}>
                {reminder.description}
              </Text>
            ) : null}
          </View>

          <MaterialDesignIcons
            name="chevron-right"
            size={23}
            color={colors.text}
          />
        </View>
      </PlatformCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 1,
    gap: 5,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.65,
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 12,
    opacity: 0.55,
  },
});
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

import { PlatformCard } from '../ui/card';
import type { Reminder } from '../../types/reminder.types';

interface Props {
  reminders: Reminder[];
  onSeeAll: () => void;
  onReminderPress: (reminder: Reminder) => void;
}

const categoryColors: Record<string, string> = {
  health: '#16A34A',
  work: '#2563EB',
  personal: '#9333EA',
  other: '#EA580C',
};

export default function UpcomingReminders({
  reminders,
  onSeeAll,
  onReminderPress,
}: Props) {
  const { colors } = useTheme();

  const upcoming = reminders
    .filter(item => item.status === 'pending' || item.status === 'snoozed')
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() -
        new Date(b.scheduledAt).getTime(),
    )
    .slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Upcoming reminders
        </Text>

        <Pressable onPress={onSeeAll}>
          <Text style={[styles.seeAll, { color: colors.primary }]}>
            See all
          </Text>
        </Pressable>
      </View>

      <PlatformCard style={styles.list}>
        {upcoming.length === 0 ? (
          <Text style={{ color: colors.text, opacity: 0.6 }}>
            No upcoming reminders. Enjoy your free time!
          </Text>
        ) : (
          upcoming.map((item, index) => (
            <React.Fragment key={item.id}>
              <Pressable
                onPress={() => onReminderPress(item)}
                style={styles.item}
              >
                <View
                  style={[
                    styles.categoryIcon,
                    {
                      backgroundColor:
                        `${categoryColors[item.categoryId]}18`,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: categoryColors[item.categoryId],
                      fontWeight: '700',
                    }}
                  >
                    {item.categoryId === 'health'
                      ? '♥'
                      : item.categoryId === 'work'
                        ? '▣'
                        : '☆'}
                  </Text>
                </View>

                <View style={styles.details}>
                  <Text
                    numberOfLines={1}
                    style={[styles.itemTitle, { color: colors.text }]}
                  >
                    {item.title}
                  </Text>

                  <Text style={[styles.time, { color: colors.text }]}>
                    {new Date(item.scheduledAt).toLocaleTimeString(
                      'en-IN',
                      {
                        hour: 'numeric',
                        minute: '2-digit',
                      },
                    )}
                  </Text>
                </View>

                <View
                  style={[
                    styles.status,
                    { backgroundColor: colors.primary + '15' },
                  ]}
                >
                  <Text style={{ color: colors.primary, fontSize: 10 }}>
                    {item.status === 'snoozed' ? 'Snoozed' : 'Upcoming'}
                  </Text>
                </View>
              </Pressable>

              {index !== upcoming.length - 1 && (
                <View
                  style={[
                    styles.divider,
                    { backgroundColor: colors.border },
                  ]}
                />
              )}
            </React.Fragment>
          ))
        )}
      </PlatformCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
  },
  list: {
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 1,
    gap: 5,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    opacity: 0.6,
  },
  status: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});
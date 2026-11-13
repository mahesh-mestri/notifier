import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTheme } from '@react-navigation/native';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type {
  BottomTabParamList,
  AppStackParamList,
} from '../../navigation/types/navigation.types';

import { mockReminders } from '../../data/mockReminders';
import ReminderFilter, {
  ReminderFilterType,
} from '../../components/reminders/ReminderFilter';
import ReminderSearch from '../../components/reminders/ReminderSearch';
import ReminderItem from '../../components/reminders/ReminderItem.tsx';


export default function RemindersScreen({ navigation }: any) {
  const { colors } = useTheme();

  const [filter, setFilter] = useState<ReminderFilterType>('Today');
  const [search, setSearch] = useState('');


  const filteredReminders = useMemo(() => {
    const now = new Date();

    return mockReminders.filter(reminder => {
      const reminderDate = new Date(reminder.scheduledAt);

      const sameDay =
        reminderDate.getDate() === now.getDate() &&
        reminderDate.getMonth() === now.getMonth() &&
        reminderDate.getFullYear() === now.getFullYear();

      let matchesFilter = false;

      switch (filter) {
        case 'Today':
          matchesFilter = sameDay &&
            (reminder.status === 'pending' ||
              reminder.status === 'snoozed');
          break;

        case 'Upcoming':
          matchesFilter =
            reminderDate > now &&
            (reminder.status === 'pending' ||
              reminder.status === 'snoozed');
          break;

        case 'Completed':
          matchesFilter = reminder.status === 'completed';
          break;

        case 'Missed':
          matchesFilter = reminder.status === 'missed';
          break;
      }

      const matchesSearch = reminder.title
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      return matchesFilter && matchesSearch;
    }).sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() -
        new Date(b.scheduledAt).getTime(),
    );
  }, [filter, search]);

  return (
      <FlatList
        data={filteredReminders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ReminderItem
            reminder={item}
            onPress={() =>
              navigation.navigate('ReminderDetails', {
                reminderId: item.id,
              })
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.heading}>
                <Text style={[styles.title, { color: colors.text }]}>
                  Reminders
                </Text>
                <Text style={[styles.subtitle, { color: colors.text }]}>
                  Manage all your reminders in one place.
                </Text>
              </View>

              <Pressable
                onPress={() => navigation.navigate('CreateReminder')}
                style={[
                  styles.addButton,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.addButtonText}>+</Text>
              </Pressable>
            </View>

            <ReminderSearch value={search} onChange={setSearch} />

            <ReminderFilter selected={filter} onChange={setFilter} />

            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {filter} · {filteredReminders.length} reminders
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 32 }}>🔔</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No reminders found
            </Text>
            <Text style={[styles.subtitle, { color: colors.text }]}>
              Try another filter or create a reminder.
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior='always'
      />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 12,
    paddingBottom: 32,
  },
  header: {
    gap: 20,
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 27,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.65,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 27,
    lineHeight: 30,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 50,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
});

import React, { memo, useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTheme } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NativeBottomTabScreenProps } from '@bottom-tabs/react-navigation';

import { mockReminders } from '../../data/mockReminders';

import {
  AppStackParamList,
  BottomTabParamList,
} from '../../navigation/types/navigation.types';

type Props = NativeBottomTabScreenProps<BottomTabParamList, 'Home'>;

function HomeScreen({ navigation }: Props) {
  const { colors } = useTheme();

  const nav =
    navigation.getParent<NativeStackNavigationProp<AppStackParamList>>();

  const today = new Date();

  const todayReminders = useMemo(() => {
    return mockReminders
      .filter(reminder => {
        const reminderDate = new Date(reminder.scheduledAt);

        return (
          reminderDate.getDate() === today.getDate() &&
          reminderDate.getMonth() === today.getMonth() &&
          reminderDate.getFullYear() === today.getFullYear()
        );
      })
      .sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() -
          new Date(b.scheduledAt).getTime(),
      );
  }, []);

  const upcomingCount = useMemo(() => {
    return mockReminders.filter(
      reminder =>
        reminder.status === 'pending' &&
        new Date(reminder.scheduledAt).getTime() > today.getTime(),
    ).length;
  }, []);

  const completedCount = useMemo(() => {
    return mockReminders.filter(
      reminder => reminder.status === 'completed',
    ).length;
  }, []);

  const dateLabel = today.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const greeting = (() => {
    const hour = today.getHours();

    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';

    return 'Good Evening';
  })();

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

  const formatCategory = (categoryId: string) =>
    categoryId.charAt(0).toUpperCase() + categoryId.slice(1);

  const handleReminderPress = (reminderId: string) => {
    nav?.navigate('ReminderDetails', { reminderId });
  };

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: colors.background },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Dashboard Header */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <Text style={[styles.greeting, { color: colors.text }]}>
              {greeting} 👋
            </Text>

            <Text
              style={[
                styles.date,
                { color: colors.text },
              ]}
            >
              {dateLabel}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notification settings"
            style={[
              styles.notificationButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => nav?.navigate('NotificationSettings')}
          >
            <Text style={[styles.notificationIcon, { color: colors.primary }]}>
              ♧
            </Text>
          </Pressable>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <SummaryCard
            count={todayReminders.length}
            label="Today"
            colors={colors}
          />

          <SummaryCard
            count={upcomingCount}
            label="Upcoming"
            colors={colors}
          />

          <SummaryCard
            count={completedCount}
            label="Completed"
            colors={colors}
          />
        </View>

        {/* Today's Reminders */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Today's Reminders
          </Text>

          <Pressable onPress={() => navigation.navigate('Reminders')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>
              See All
            </Text>
          </Pressable>
        </View>

        <View
          style={[
            styles.remindersContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {todayReminders.length > 0 ? (
            todayReminders.slice(0, 5).map((reminder, index) => (
              <Pressable
                key={reminder.id}
                style={[
                  styles.reminderRow,
                  index !== Math.min(todayReminders.length, 5) - 1 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.border,
                  },
                ]}
                onPress={() => handleReminderPress(reminder.id)}
              >
                <View
                  style={[
                    styles.checkCircle,
                    {
                      borderColor:
                        reminder.status === 'completed'
                          ? colors.primary
                          : colors.border,
                      backgroundColor:
                        reminder.status === 'completed'
                          ? colors.primary
                          : 'transparent',
                    },
                  ]}
                >
                  {reminder.status === 'completed' && (
                    <Text style={styles.checkMark}>✓</Text>
                  )}
                </View>

                <View style={styles.reminderInfo}>
                  <Text
                    style={[
                      styles.reminderTitle,
                      { color: colors.text },
                      reminder.status === 'completed' &&
                        styles.completedTitle,
                    ]}
                    numberOfLines={1}
                  >
                    {reminder.title}
                  </Text>

                  <Text
                    style={[
                      styles.reminderTime,
                      { color: colors.text },
                    ]}
                  >
                    {formatTime(reminder.scheduledAt)}
                  </Text>
                </View>

                <View
                  style={[
                    styles.categoryBadge,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      { color: colors.text },
                    ]}
                  >
                    {formatCategory(reminder.categoryId)}
                  </Text>
                </View>
              </Pressable>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No reminders for today
              </Text>

              <Text
                style={[
                  styles.emptyDescription,
                  { color: colors.text },
                ]}
              >
                Create a reminder and stay organized.
              </Text>
            </View>
          )}
        </View>

        {todayReminders.length > 5 && (
          <Pressable
            onPress={() => navigation.navigate('Reminders')}
          >
            <Text style={[styles.moreReminders, { color: colors.primary }]}>
              View all {todayReminders.length} reminders
            </Text>
          </Pressable>
        )}
      </ScrollView>

      {/* Floating Create Reminder Button */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Create reminder"
        style={[
          styles.fab,
          { backgroundColor: colors.primary },
        ]}
        onPress={() => nav?.navigate('CreateReminder')}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

type SummaryCardProps = {
  count: number;
  label: string;
  colors: ReturnType<typeof useTheme>['colors'];
};

const SummaryCard = memo(({
  count,
  label,
  colors,
}: SummaryCardProps) => (
  <View
    style={[
      styles.summaryCard,
      {
        backgroundColor: colors.card,
        borderColor: colors.border,
      },
    ]}
  >
    <Text style={[styles.summaryCount, { color: colors.primary }]}>
      {count}
    </Text>

    <Text style={[styles.summaryLabel, { color: colors.text }]}>
      {label}
    </Text>
  </View>
));

export default memo(HomeScreen);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 110,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  greetingContainer: {
    flex: 1,
    gap: 5,
  },

  greeting: {
    fontSize: 20,
    fontWeight: '700',
  },

  date: {
    fontSize: 12,
    opacity: 0.65,
  },

  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },

  notificationIcon: {
    fontSize: 23,
  },

  summaryContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },

  summaryCard: {
    flex: 1,
    minHeight: 82,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
    justifyContent: 'center',
  },

  summaryCount: {
    fontSize: 25,
    fontWeight: '800',
  },

  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
    marginTop: 3,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },

  seeAll: {
    fontSize: 13,
    fontWeight: '600',
  },

  remindersContainer: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
  },

  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    gap: 12,
  },

  checkCircle: {
    width: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkMark: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  reminderInfo: {
    flex: 1,
  },

  reminderTitle: {
    fontSize: 13,
    fontWeight: '600',
  },

  completedTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.55,
  },

  reminderTime: {
    fontSize: 11,
    opacity: 0.65,
    marginTop: 4,
  },

  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },

  categoryText: {
    fontSize: 10,
    fontWeight: '600',
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
  },

  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
  },

  emptyDescription: {
    fontSize: 12,
    opacity: 0.65,
    marginTop: 6,
  },

  moreReminders: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 14,
  },

  fab: {
    position: 'absolute',
    right: 22,
    bottom: '12%',
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },

  fabText: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '400',
    lineHeight: 38,
  },
});

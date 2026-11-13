import React, { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTheme } from '@react-navigation/native';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';


import { mockReminders, mockCategories } from '../../data/mockReminders';
import HomeHeader from '../../components/home/HomeHeader';
import DailyProgressCard from '../../components/home/DailyProgressCard';
import ReminderSummary from '../../components/home/ReminderSummary';
import UpcomingReminders from '../../components/home/UpcomingReminders';
import CategorySection from '../../components/home/CategorySection';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeBottomTabScreenProps } from '@bottom-tabs/react-navigation';
import { AppStackParamList, BottomTabParamList } from '../../navigation/types/navigation.types';

type Props = NativeBottomTabScreenProps<BottomTabParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { colors } = useTheme();

  const parentNavigation =
    navigation.getParent<NativeStackNavigationProp<AppStackParamList>>();

  const todayReminders = useMemo(() => {
    const today = new Date();

    return mockReminders.filter(reminder => {
      const reminderDate = new Date(reminder.scheduledAt);

      return (
        reminderDate.getDate() === today.getDate() &&
        reminderDate.getMonth() === today.getMonth() &&
        reminderDate.getFullYear() === today.getFullYear()
      );
    });
  }, []);

  const completedCount = todayReminders.filter(
    reminder => reminder.status === 'completed',
  ).length;

  const totalCount = todayReminders.length;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior='always'
    >
      <HomeHeader />

      <DailyProgressCard
        completed={completedCount}
        total={totalCount}
      />

      <ReminderSummary
        completed={completedCount}
        total={totalCount}
      />

      <UpcomingReminders
        reminders={todayReminders}
        onSeeAll={() => navigation.navigate('Reminders')}
        onReminderPress={reminder =>
          parentNavigation?.navigate('ReminderDetails', {
            reminderId: reminder.id,
          })
        }
      />

      <CategorySection
        categories={mockCategories}
        onSeeAll={() => navigation.navigate('Categories')}
        onCategoryPress={() => navigation.navigate('Categories')}
      />

      <Pressable
        style={[
          styles.createButton,
          { backgroundColor: colors.primary },
        ]}
        onPress={() => parentNavigation?.navigate('CreateReminder')}
      >
        <Text style={styles.createButtonText}>
          + Create Reminder
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
    gap: 22,
  },
  createButton: {
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
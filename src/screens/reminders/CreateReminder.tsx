
import React, { useRef, useState } from 'react';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useTheme } from '@react-navigation/native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';

import type { AppStackParamList } from '../../navigation/types/navigation.types';

import type {
  Reminder,
  ReminderCategory,
} from '../../types/reminder.types';

import { mockReminders } from '../../data/mockReminders';

import Button from '../../components/ui/Button';

import ReminderDateTimeBottomSheet, {

  type ReminderDateTimeBottomSheetRef,
  type ReminderPickerField,
} from '../../components/reminders/ReminderDateTimeBottomSheet';

type Props = NativeStackScreenProps<
  AppStackParamList,
  'CreateReminder'
>;

type ScheduleType = 'single' | 'range';

const categories: {
  label: string;
  value: ReminderCategory;
}[] = [
    { label: 'Personal', value: 'personal' },
    { label: 'Work', value: 'work' },
    { label: 'Health', value: 'health' },
    { label: 'Other', value: 'other' },
  ];

export default function CreateReminderScreen({
  navigation,
}: Props) {
  const { colors } = useTheme();

  // Bottom sheet reference
  const reminderPickerRef =
    useRef<ReminderDateTimeBottomSheetRef>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [categoryId, setCategoryId] =
    useState<ReminderCategory>('personal');

  // Schedule state
  const [scheduleType, setScheduleType] =
    useState<ScheduleType>('single');

  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });

  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });

  const [selectedTime, setSelectedTime] = useState(() => {
    const date = new Date();
    date.setHours(9, 0, 0, 0);
    return date;
  });

  // Reminder preferences
  const [isRecurring, setIsRecurring] = useState(false);

  const [notificationEnabled, setNotificationEnabled] =
    useState(true);

  // Formatting
  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });

  // Open reminder date/time bottom sheet
  const openPicker = (
    field: ReminderPickerField,
  ) => {
    const currentValue =
      field === 'time'
        ? selectedTime
        : field === 'start'
          ? startDate
          : endDate;

    const minimumDate =
      field === 'end'
        ? startDate
        : field === 'start'
          ? new Date(new Date().setHours(0, 0, 0, 0))
          : undefined;

    reminderPickerRef.current?.open({
      field,
      value: currentValue,
      minimumDate,
    });
  };

  // Receive selected value from bottom sheet
  const handlePickerConfirm = (
    field: ReminderPickerField,
    selectedDate: Date,
  ) => {
    if (field === 'time') {
      setSelectedTime(selectedDate);
      return;
    }

    if (field === 'start') {
      setStartDate(selectedDate);

      setEndDate(previous =>
        previous < selectedDate
          ? selectedDate
          : previous,
      );

      return;
    }

    setEndDate(selectedDate);
  };

  // Schedule type
  const handleScheduleTypeChange = (
    type: ScheduleType,
  ) => {
    setScheduleType(type);

    if (type === 'single') {
      setEndDate(startDate);
    }
  };

  // Create reminder
  const handleCreateReminder = () => {
    if (!title.trim()) {
      Alert.alert(
        'Required',
        'Please enter a reminder title.',
      );
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedStart = new Date(startDate);
    selectedStart.setHours(0, 0, 0, 0);

    const selectedEnd = new Date(endDate);
    selectedEnd.setHours(0, 0, 0, 0);

    if (selectedStart < today) {
      Alert.alert(
        'Invalid date',
        'Start date cannot be in the past.',
      );
      return;
    }

    if (
      scheduleType === 'range' &&
      selectedEnd < selectedStart
    ) {
      Alert.alert(
        'Invalid date range',
        'End date must be after or equal to start date.',
      );
      return;
    }

    const scheduledDate = new Date(startDate);

    scheduledDate.setHours(
      selectedTime.getHours(),
      selectedTime.getMinutes(),
      0,
      0,
    );

    if (scheduledDate.getTime() <= Date.now()) {
      Alert.alert(
        'Invalid time',
        'Please select a future date and time.',
      );
      return;
    }

    const newReminder: Reminder = {
      id: `reminder_${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      categoryId,
      scheduledAt: scheduledDate.toISOString(),
      status: 'pending',
      isRecurring,
      notificationEnabled,
    };

    // Temporary mock-data storage.
    // Replace with reminderService.create() later.
    mockReminders.push(newReminder);

    Alert.alert(
      'Reminder created',
      'Your reminder has been created successfully.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.screen,
        { backgroundColor: colors.background },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="always"
      >
        {/* Header */}
        <View style={styles.intro}>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            Add something important to your schedule.
          </Text>
        </View>

        {/* Title */}
        <FormSection title="Reminder title">
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="What do you need to remember?"
            placeholderTextColor={colors.text + '80'}
            style={[
              styles.input,
              {
                color: colors.text,
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            maxLength={100}
          />
        </FormSection>

        {/* Description */}
        <FormSection title="Description (optional)">
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Add some details..."
            placeholderTextColor={colors.text + '80'}
            multiline
            textAlignVertical="top"
            style={[
              styles.input,
              styles.descriptionInput,
              {
                color: colors.text,
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            maxLength={500}
          />
        </FormSection>

        {/* Category */}
        <FormSection title="Category">
          <View style={styles.categoryList}>
            {categories.map(category => {
              const selected = categoryId === category.value;

              return (
                <Pressable
                  key={category.value}
                  onPress={() => setCategoryId(category.value)}
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor: selected
                        ? colors.primary + '18'
                        : colors.card,
                      borderColor: selected
                        ? colors.primary
                        : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: selected
                        ? colors.primary
                        : colors.text,
                      fontWeight: selected ? '700' : '500',
                    }}
                  >
                    {category.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </FormSection>

        {/* Schedule */}
        <FormSection title="Schedule">
          <View style={styles.scheduleOptions}>
            <ScheduleOption
              label="One-time"
              selected={scheduleType === 'single'}
              onPress={() => handleScheduleTypeChange('single')}
            />

            <ScheduleOption
              label="Date Range"
              selected={scheduleType === 'range'}
              onPress={() => handleScheduleTypeChange('range')}
            />
          </View>

          <DateSelectionRow
            label={
              scheduleType === 'single'
                ? 'Reminder Date'
                : 'Start Date'
            }
            value={formatDate(startDate)}
            onPress={() => openPicker('start')}
          />

          {scheduleType === 'range' && (
            <DateSelectionRow
              label="End Date"
              value={formatDate(endDate)}
              onPress={() => openPicker('end')}
            />
          )}

          <DateSelectionRow
            label="Reminder Time"
            value={formatTime(selectedTime)}
            onPress={() => openPicker('time')}
          />

          {scheduleType === 'range' && (
            <Text
              style={[
                styles.helperText,
                { color: colors.text },
              ]}
            >
              This reminder is intended to repeat daily between
              the selected dates.
            </Text>
          )}
        </FormSection>

        {/* Repeat */}
        <FormSection title="Repeat">
          <SettingRow
            icon="repeat"
            title="Recurring reminder"
            subtitle="Repeat this reminder"
            value={isRecurring}
            onValueChange={setIsRecurring}
          />
        </FormSection>

        {/* Notification */}
        <FormSection title="Notification">
          <SettingRow
            icon="bell-outline"
            title="Enable notification"
            subtitle="Notify me when this reminder is due"
            value={notificationEnabled}
            onValueChange={setNotificationEnabled}
          />
        </FormSection>

        {/* Create Reminder */}
        <Button
          mode="contained"
          buttonColor={colors.primary}
          textColor="#FFFFFF"
          icon="check"
          onPress={handleCreateReminder}
          style={styles.saveButton}
        >
          Create Reminder
        </Button>
      </ScrollView>

      {/* Reminder Date & Time Bottom Sheet */}
      <ReminderDateTimeBottomSheet
        ref={reminderPickerRef}
        onConfirm={handlePickerConfirm}
      />
    </KeyboardAvoidingView>
  );
}

/* ----------------------------------
   Form Section
----------------------------------- */

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.formSection}>
      <Text style={[styles.label, { color: colors.text }]}>
        {title}
      </Text>

      {children}
    </View>
  );
}

/* ----------------------------------
   Schedule Option
----------------------------------- */

function ScheduleOption({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.scheduleOption,
        {
          borderColor: selected
            ? colors.primary
            : colors.border,
          backgroundColor: selected
            ? colors.primary + '12'
            : colors.card,
        },
      ]}
    >
      <Text
        style={{
          color: selected ? colors.primary : colors.text,
          fontWeight: selected ? '700' : '500',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/* ----------------------------------
   Date Selection Row
----------------------------------- */

function DateSelectionRow({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.dateRow,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <MaterialDesignIcons
        name="calendar-clock-outline"
        size={22}
        color={colors.primary}
      />

      <View style={styles.dateText}>
        <Text
          style={[
            styles.dateLabel,
            { color: colors.text },
          ]}
        >
          {label}
        </Text>

        <Text
          style={[
            styles.dateValue,
            { color: colors.text },
          ]}
        >
          {value}
        </Text>
      </View>

      <MaterialDesignIcons
        name="chevron-right"
        size={22}
        color={colors.text}
      />
    </Pressable>
  );
}

/* ----------------------------------
   Setting Row
----------------------------------- */

function SettingRow({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
}: {
  icon: string;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.settingRow,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <MaterialDesignIcons
        name={icon as any}
        size={23}
        color={colors.primary}
      />

      <View style={styles.settingText}>
        <Text
          style={[
            styles.settingTitle,
            { color: colors.text },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.helperText,
            { color: colors.text },
          ]}
        >
          {subtitle}
        </Text>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: '#767577',
          true: colors.primary,
        }}
        style={{alignSelf: 'center'}}
      />
    </View>
  );
}

/* ----------------------------------
   Styles
----------------------------------- */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  intro: {
    marginBottom: 26,
  },

  subtitle: {
    fontSize: 13,
    opacity: 0.65,
    marginTop: 6,
  },

  formSection: {
    marginBottom: 22,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },

  input: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 15,
    fontSize: 14,
  },

  descriptionInput: {
    minHeight: 105,
    paddingTop: 14,
  },

  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },

  categoryButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 17,
    paddingVertical: 11,
  },

  scheduleOptions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },

  scheduleOption: {
    flex: 1,
    alignItems: 'center',
    padding: 13,
    borderWidth: 1,
    borderRadius: 12,
  },

  dateRow: {
    minHeight: 65,
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  dateText: {
    flex: 1,
  },

  dateLabel: {
    fontSize: 12,
    opacity: 0.6,
  },

  dateValue: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 3,
  },

  helperText: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 6,
  },

  settingRow: {
    minHeight: 72,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  settingText: {
    flex: 1,
  },

  settingTitle: {
    fontSize: 13,
    fontWeight: '600',
  },

  saveButton: {
    marginTop: 8,
  },
});

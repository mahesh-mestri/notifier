import React, { memo, useCallback, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { format } from 'date-fns';

import { FormSection, FieldError } from '../../components/ui/Field';
import TextInput from '../../components/ui/TextInput';
import Button from '../../components/ui/Button';
import {
  CreateReminderRequest,
  ReminderCategory,
  ReminderFormErrors,
  ReminderFormValues,
  ReminderSchedule,
  scheduleType,
} from '../../types/reminder.types';
import ReminderCategoryComp from '../../components/reminders/ReminderCategory';
import ReminderTypeSelector from '../../components/reminders/ReminderTypeSelector';
import OneTimeSchedule from '../../components/reminders/schedule/OneTimeSchedule';
import IntervalSchedule from '../../components/reminders/schedule/IntervalSchedule';
import DailySchedule from '../../components/reminders/schedule/DailySchedule';
import WeeklySchedule from '../../components/reminders/schedule/WeeklySchedule';
import MonthlySchedule from '../../components/reminders/schedule/MonthlySchedule';
import { reminderSchema } from '../../schema/reminder.schema';
import { useToast } from '../../providers/ToastProvider';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  createReminder,
  clearReminderError,
  selectReminderLoading,
} from '../../store/feature/reminder/reminderSlice';

const createDefaultValues = (): ReminderFormValues => ({
  title: '',
  description: '',
  categoryId: 'PERSONAL',

  scheduleType: 'ONCE',

  startDate: new Date(),
  endDate: null,

  reminderTime: new Date(),

  intervalValue: 30,
  intervalUnit: 'MINUTES',

  windowStartTime: (() => {
    const date = new Date();
    date.setHours(7, 0, 0, 0);
    return date;
  })(),

  windowEndTime: (() => {
    const date = new Date();
    date.setHours(22, 0, 0, 0);
    return date;
  })(),

  selectedWeekdays: [],

  dayOfMonth: 1,

  notificationEnabled: true,
});

function CreateReminder() {
  const { colors } = useTheme();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const isSubmitting = useAppSelector(selectReminderLoading);

  const [form, setForm] = useState<ReminderFormValues>(
    createDefaultValues(),
  );

  const [errors, setErrors] = useState<ReminderFormErrors>({});

  const clearErrorField = (field: keyof ReminderFormErrors) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleTitleChange = (value: string) => {
    setForm(prev => ({ ...prev, title: value }));
    clearErrorField('title');
  };

  const handleDescriptionChange = (value: string) => {
    setForm(prev => ({ ...prev, description: value }));
    clearErrorField('description');
  };

  const handleCategory = useCallback((value: ReminderCategory) => {
    setForm(prev => ({
      ...prev,
      categoryId: value,
    }));
  }, []);

  const handlerReminderTypeSelector = useCallback(
    (value: scheduleType) => {
      if (__DEV__) {
        console.warn('value in handlerReminderTypeSelector', value);
      }
      setForm(prev => ({
        ...prev,
        ...createDefaultValues(),
        title: prev.title,
        description: prev.description,
        categoryId: prev.categoryId,
        scheduleType: value,
      }));

      setErrors({});
    },
    [],
  );

  const handleFormChange = <K extends keyof ReminderFormValues>(
    key: K,
    value: ReminderFormValues[K],
  ) => {
    setForm(prev => ({
      ...prev,
      [key]: value,
    }));
    clearErrorField('schedule');
  };

  const buildSchedulePayload = (): ReminderSchedule => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    switch (form.scheduleType) {
      case 'ONCE':
        return {
          type: form.scheduleType,
          reminderDate: format(form.startDate, 'yyyy-MM-dd'),
          reminderTime: format(form.reminderTime, 'HH:mm'),
          timeZone,
        };

      case 'INTERVAL':
        return {
          type: form.scheduleType,
          startDate: format(form.startDate, 'yyyy-MM-dd'),
          endDate: form.endDate
            ? format(form.endDate, 'yyyy-MM-dd')
            : undefined,
          intervalValue: form.intervalValue,
          intervalUnit: form.intervalUnit,
          windowStartTime: format(form.windowStartTime, 'HH:mm'),
          windowEndTime: format(form.windowEndTime, 'HH:mm'),
          timeZone,
        };

      case 'DAILY':
        return {
          type: form.scheduleType,
          startDate: format(form.startDate, 'yyyy-MM-dd'),
          endDate: form.endDate
            ? format(form.endDate, 'yyyy-MM-dd')
            : undefined,
          timeZone,
          reminderTime: format(form.reminderTime, 'HH:mm:ss'),
        };

      case 'WEEKLY':
        return {
          type: form.scheduleType,
          startDate: format(form.startDate, 'yyyy-MM-dd'),
          endDate: form.endDate
            ? format(form.endDate, 'yyyy-MM-dd')
            : undefined,
          reminderTime: format(form.reminderTime, 'HH:mm'),
          weekdays: form.selectedWeekdays,
          timeZone,
        };

      case 'MONTHLY':
        return {
          type: form.scheduleType,
          startDate: format(form.startDate, 'yyyy-MM-dd'),
          endDate: form.endDate
            ? format(form.endDate, 'yyyy-MM-dd')
            : undefined,
          reminderTime: format(form.reminderTime, 'HH:mm'),
          dayOfMonth: form.dayOfMonth,
          timeZone,
        };
    }
  };

  const _createReminder = async () => {
    if (isSubmitting) return;

    const schedule = buildSchedulePayload();

    const payload: CreateReminderRequest = {
      title: form.title.trim(),
      description: form.description.trim(),
      categoryId: form.categoryId,
      scheduleType: schedule.type,
      schedule,
      notificationEnabled: form.notificationEnabled,
    };

    const result = reminderSchema.safeParse(payload);
    console.warn("result after safeparse: ", result)
    if (!result.success) {
      toast.showToast(
        result.error.issues[0].message,
        'error',
        'Validation Error',
      );

      const nextErrors: ReminderFormErrors = {};
      result.error.issues.forEach(issue => {
        const field = issue.path[0];

        if (field === 'title' || field === 'description') {
          nextErrors[field] = issue.message;
        } else if (field === 'schedule' || field === 'scheduleType') {
          nextErrors.schedule = issue.message;
        }
      });

      setErrors(nextErrors);
      return;
    }

    setErrors({});
    dispatch(clearReminderError());

    try {
      if (__DEV__) {
        console.log('Submitting reminder payload:', result.data);
      }

      await dispatch(createReminder(result.data)).unwrap();

      toast.showToast(
        'Reminder created successfully!',
        'success',
        'Reminder Saved',
      );

      setForm(createDefaultValues());
    } catch (error) {
      console.warn('error: ', error);
      toast.showToast(
        typeof error === 'string'
          ? error
          : 'Could not create reminder',
        'error',
        'Creation Failed',
      );
    }
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="always"
      contentContainerStyle={[styles.container, styles.p12]}
    >
      {/* Reminder Title */}
      <FormSection title="Reminder Title">
        <TextInput
          placeholder="What do you want to remember?"
          placeholderTextColor={colors.text}
          value={form.title}
          onChangeText={handleTitleChange}
          maxLength={100}
        />

        <FieldError message={errors.title} />
      </FormSection>

      {/* Description */}
      <FormSection title="Description (Optional)">
        <TextInput
          style={[styles.descriptionInput]}
          placeholder="Add more details..."
          placeholderTextColor={colors.text}
          value={form.description}
          onChangeText={handleDescriptionChange}
          multiline
          numberOfLines={4}
          maxLength={500}
          textAlignVertical="top"
        />

        <FieldError message={errors.description} />
      </FormSection>

      {/* category */}
      <ReminderCategoryComp
        value={form.categoryId}
        onChange={handleCategory}
      />

      {/* schedules */}
      <ReminderTypeSelector
        value={form.scheduleType}
        onChange={handlerReminderTypeSelector}
      />

      {/* Schedule Configuration */}
      {form.scheduleType === 'ONCE' && (
        <OneTimeSchedule
          value={{
            startDate: form.startDate,
            reminderTime: form.reminderTime,
          }}
          onChange={handleFormChange}
        />
      )}

      {form.scheduleType === 'INTERVAL' && (
        <IntervalSchedule
          value={{
            startDate: form.startDate,
            endDate: form.endDate,
            intervalValue: form.intervalValue,
            intervalUnit: form.intervalUnit,
            windowStartTime: form.windowStartTime,
            windowEndTime: form.windowEndTime,
          }}
          onChange={handleFormChange}
        />
      )}

      {form.scheduleType === 'DAILY' && (
        <DailySchedule
          value={{
            startDate: form.startDate,
            endDate: form.endDate,
            reminderTime: form.reminderTime,
          }}
          onChange={handleFormChange}
        />
      )}

      {form.scheduleType === 'WEEKLY' && (
        <WeeklySchedule
          value={{
            startDate: form.startDate,
            endDate: form.endDate,
            reminderTime: form.reminderTime,
            selectedWeekdays: form.selectedWeekdays,
          }}
          onChange={handleFormChange}
        />
      )}

      {form.scheduleType === 'MONTHLY' && (
        <MonthlySchedule
          value={{
            startDate: form.startDate,
            endDate: form.endDate,
            reminderTime: form.reminderTime,
            dayOfMonth: form.dayOfMonth,
          }}
          onChange={handleFormChange}
        />
      )}

      <FieldError message={errors.schedule} />

      <Button
        onPress={_createReminder}
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        Create Reminder
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  descriptionInput: {
    minHeight: 105,
    paddingTop: 14,
  },
  p12: {
    padding: 12,
  },
});

export default memo(CreateReminder);

import React, { memo, useCallback, useRef, useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { FormSection, FieldError } from '../../components/ui/Field';

import TextInput from '../../components/ui/TextInput';
import Button from '../../components/ui/Button';
import { CreateReminderRequest, Reminder, ReminderCategory as ReminderCategoryType, ReminderFormErrors, ReminderFormValues, ReminderSchedule, ReminderType } from '../../types/reminder.types';
import ReminderCategory from '../../components/reminders/ReminderCategory';
import ReminderTypeSelector from '../../components/reminders/ReminderTypeSelector';
import OneTimeSchedule from '../../components/reminders/schedule/OneTimeSchedule';
import IntervalSchedule from '../../components/reminders/schedule/IntervalSchedule';
import DailySchedule from '../../components/reminders/schedule/DailySchedule';
import WeeklySchedule from '../../components/reminders/schedule/WeeklySchedule';
import MonthlySchedule from '../../components/reminders/schedule/MonthlySchedule';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReminderDateTimeBottomSheet, { ReminderDateTimeBottomSheetRef, ReminderPickerField, ReminderPickerOptions } from '../../components/reminders/ReminderDateTimeBottomSheet';
import { reminderSchema } from '../../schema/reminder.schema';
import { format } from 'date-fns';
import { useToast } from '../../providers/ToastProvider';

interface FormErrors {
  title?: string;
  description?: string;
}

const createDefaultValues = (): ReminderFormValues => ({
  title: '',
  description: '',
  categoryId: 'personal',

  scheduleType: 'once',

  startDate: new Date(),
  endDate: null,

  reminderTime: (() => {
    const date = new Date();
    date.setHours(9, 0, 0, 0);
    return date;
  })(),

  intervalValue: 30,
  intervalUnit: 'minutes',

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

  // const [title, setTitle] = useState('');
  // const [description, setDescription] = useState('');
  // const [categoryId, setCategoryId] = useState<ReminderCategoryType>('personal');
  // const [scheduleType, setScheduleType] = useState<ReminderType>('once');
  const [form, setForm] = useState<ReminderFormValues>(
    createDefaultValues(),
  );

  const [errors, setErrors] = useState<FormErrors>({});

  const handleTitleChange = (value: string) => {
    setForm(prev => ({ ...prev, title: value }));

    if (errors.title) {
      setErrors(prev => ({ ...prev, title: undefined }));
    }
  };

  const handleDescriptionChange = (value: string) => {
    setForm(prev => ({ ...prev, description: value }));

    if (errors.description) {
      setErrors(prev => ({ ...prev, description: undefined }));
    }
  };

  const handlerReminderTypeSelector = useCallback((value: ReminderType) => {
    setForm(prev => ({
      ...prev,
      ...createDefaultValues(),
      title: prev.title,
      description: prev.description,
      categoryId: prev.categoryId,
      scheduleType: value,
    }));

    setErrors({});
  }, []);

  const handleFormChange = <K extends keyof ReminderFormValues>(
    key: K,
    value: ReminderFormValues[K],
  ) => {
    setForm(prev => ({
      ...prev,
      [key]: value,
    }));
  };


  const buildSchedulePayload = (): ReminderSchedule => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    switch (form.scheduleType) {
      case 'once':
        return {
          type: 'once',
          date: format(form.startDate, 'yyyy-MM-dd'),
          time: format(form.reminderTime, 'HH:mm'),
          timeZone,
        };

      case 'interval':
        return {
          type: 'interval',
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

      case 'daily':
        return {
          type: 'daily',
          startDate: format(form.startDate, 'yyyy-MM-dd'),
          endDate: form.endDate
            ? format(form.endDate, 'yyyy-MM-dd')
            : undefined,
          time: format(form.reminderTime, 'HH:mm'),
          timeZone,
        };

      case 'weekly':
        return {
          type: 'weekly',
          startDate: format(form.startDate, 'yyyy-MM-dd'),
          endDate: form.endDate
            ? format(form.endDate, 'yyyy-MM-dd')
            : undefined,
          time: format(form.reminderTime, 'HH:mm'),
          weekdays: form.selectedWeekdays,
          timeZone,
        };

      case 'monthly':
        return {
          type: 'monthly',
          startDate: format(form.startDate, 'yyyy-MM-dd'),
          endDate: form.endDate
            ? format(form.endDate, 'yyyy-MM-dd')
            : undefined,
          time: format(form.reminderTime, 'HH:mm'),
          dayOfMonth: form.dayOfMonth,
          timeZone,
        };
    }
  };


  const _createReminder = () => {
    const payload: CreateReminderRequest = {
      title: form.title.trim(),
      description: form.description.trim(),
      categoryId: form.categoryId,
      schedule: buildSchedulePayload(),
      notificationEnabled: form.notificationEnabled,
    };

    const result = reminderSchema.safeParse(payload);
    if (!result.success) {
      toast.showToast(
        result.error.issues[0].message,
        'error',
        'Validation Error',
      );
      const nextErrors: ReminderFormErrors = {};

      result.error.issues.forEach(issue => {
        const field = issue.path[0];

        if (
          field === 'title' ||
          field === 'description'
        ) {
          nextErrors[field] = issue.message;
        } else if (field === 'schedule') {
          nextErrors.schedule = issue.message;
        }
      });

      setErrors(nextErrors);
      return;
    }

    setErrors({});

    console.log('Validated Payload:', result.data);

    // Next: Call create reminder API
  };


  return (
    <ScrollView
      contentInsetAdjustmentBehavior='always'
      contentContainerStyle={[styles.container, styles.p12]} >
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
          style={[
            styles.descriptionInput,
          ]}
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
      <ReminderCategory
        value={form.categoryId}
        onChange={handleDescriptionChange}
      />

      {/* schdules */}
      <ReminderTypeSelector
        value={form.scheduleType}
        onChange={handlerReminderTypeSelector}
      />

      {/* Schedule Configuration */}
      {form.scheduleType === 'once' && (
        <OneTimeSchedule
          value={{
            startDate: form.startDate,
            reminderTime: form.reminderTime,
          }}
          onChange={handleFormChange}
        />
      )}

      {form.scheduleType === 'interval' && (
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

      {/* 
      {scheduleType === 'daily' && (
        <DailySchedule
          value={{
            startDate: form.startDate,
            endDate: form.endDate,
            reminderTime: form.reminderTime,
          }}
          onChange={(key, value) => handleFormChange(key, value)}
          onPickDate={target => handlePickDate(target)}
        />
      )}

      {scheduleType === 'weekly' && (
        <WeeklySchedule
          value={{
            startDate: form.startDate,
            endDate: form.endDate,
            reminderTime: form.reminderTime,
            selectedWeekdays: form.selectedWeekdays,
          }}
          onChange={(key, value) => handleFormChange(key, value)}
          onPickDate={target => handlePickDate(target)}
        />
      )}

      {scheduleType === 'monthly' && (
        <MonthlySchedule
          value={{
            startDate: form.startDate,
            endDate: form.endDate,
            reminderTime: form.reminderTime,
            dayOfMonth: form.dayOfMonth,
          }}
          onChange={(key, value) => handleFormChange(key, value)}
          onPickDate={target => handlePickDate(target)}
        />
      )}

       */}

      <Button
        onPress={_createReminder}
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
    padding: 12
  }
});

export default memo(CreateReminder);

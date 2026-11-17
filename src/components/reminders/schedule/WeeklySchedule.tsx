
import React, { memo, useRef } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTheme } from '@react-navigation/native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { format } from 'date-fns';

import { FormSection } from '../../ui/Field';

import type {
  ReminderFormValues,
  Weekday,
} from '../../../types/reminder.types';

import ReminderDateTimeBottomSheet, {
  type ReminderDateTimeBottomSheetRef,
  type ReminderPickerField,
} from '../ReminderDateTimeBottomSheet';

type ScheduleField =
  | 'startDate'
  | 'endDate'
  | 'reminderTime'
  | 'selectedWeekdays';

type Props = {
  value: Pick<ReminderFormValues, ScheduleField>;
  onChange: <K extends ScheduleField>(
    key: K,
    value: ReminderFormValues[K],
  ) => void;
};

const WEEKDAYS: { label: string; short: string; value: Weekday }[] = [
  { label: 'Sunday', short: 'Sun', value: 0 },
  { label: 'Monday', short: 'Mon', value: 1 },
  { label: 'Tuesday', short: 'Tue', value: 2 },
  { label: 'Wednesday', short: 'Wed', value: 3 },
  { label: 'Thursday', short: 'Thu', value: 4 },
  { label: 'Friday', short: 'Fri', value: 5 },
  { label: 'Saturday', short: 'Sat', value: 6 },
];

function WeeklySchedule({ value, onChange }: Props) {
  const { colors } = useTheme();

  const bottomSheetRef =
    useRef<ReminderDateTimeBottomSheetRef>(null);

  const handleOpenPicker = (field: ReminderPickerField) => {
    const pickerValues: Partial<
      Record<ReminderPickerField, Date>
    > = {
      start: value.startDate,
      end: value.endDate ?? value.startDate,
      time: value.reminderTime,
    };

    const selectedValue = pickerValues[field];

    if (!selectedValue) return;

    bottomSheetRef.current?.open({
      field,
      value: selectedValue,
      minimumDate:
        field === 'end' ? value.startDate : undefined,
    });
  };

  const handleConfirm = (
    field: ReminderPickerField,
    date: Date,
  ) => {
    switch (field) {
      case 'start':
        onChange('startDate', date);
        break;

      case 'end':
        onChange('endDate', date);
        break;

      case 'time':
        onChange('reminderTime', date);
        break;
    }
  };

  const handleWeekdayToggle = (day: Weekday) => {
    const isSelected = value.selectedWeekdays.includes(day);

    const updatedDays = isSelected
      ? value.selectedWeekdays.filter(item => item !== day)
      : [...value.selectedWeekdays, day];

    onChange('selectedWeekdays', updatedDays);
  };

  const renderDatePicker = (
    label: string,
    field: 'start' | 'end',
    date: Date | null,
  ) => (
    <Pressable
      style={[
        styles.pickerContainer,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={() => handleOpenPicker(field)}
    >
      <Text
        style={[
          styles.pickerLabel,
          { color: colors.text },
        ]}
      >
        {label}
      </Text>

      <View style={styles.pickerValue}>
        <MaterialDesignIcons
          name="calendar-month-outline"
          size={20}
          color={colors.primary}
        />

        <Text
          style={[
            styles.pickerText,
            { color: colors.text },
          ]}
        >
          {date ? format(date, 'dd MMM yyyy') : 'Select date'}
        </Text>
      </View>
    </Pressable>
  );

  const renderTimePicker = () => (
    <Pressable
      style={[
        styles.pickerContainer,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={() => handleOpenPicker('time')}
    >
      <Text
        style={[
          styles.pickerLabel,
          { color: colors.text },
        ]}
      >
        Reminder Time
      </Text>

      <View style={styles.pickerValue}>
        <MaterialDesignIcons
          name="clock-outline"
          size={20}
          color={colors.primary}
        />

        <Text
          style={[
            styles.pickerText,
            { color: colors.text },
          ]}
        >
          {format(value.reminderTime, 'hh:mm a')}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View>
      <FormSection title="Schedule Duration">
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            {renderDatePicker(
              'Start Date',
              'start',
              value.startDate,
            )}
          </View>

          <View style={styles.halfWidth}>
            {renderDatePicker(
              'End Date (Optional)',
              'end',
              value.endDate,
            )}
          </View>
        </View>
      </FormSection>

      <FormSection title="Reminder Time">
        {renderTimePicker()}
      </FormSection>

      <FormSection title="Repeat On">
        <View style={styles.weekdaysContainer}>
          {WEEKDAYS.map(day => {
            const selected = value.selectedWeekdays.includes(
              day.value,
            );

            return (
              <Pressable
                key={day.value}
                onPress={() => handleWeekdayToggle(day.value)}
                style={[
                  styles.weekdayButton,
                  {
                    backgroundColor: selected
                      ? colors.primary
                      : colors.card,
                    borderColor: selected
                      ? colors.primary
                      : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.weekdayText,
                    {
                      color: selected
                        ? '#FFFFFF'
                        : colors.text,
                    },
                  ]}
                >
                  {day.short}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text
          style={[
            styles.helperText,
            { color: colors.text },
          ]}
        >
          Select the days when you want to receive this reminder.
        </Text>
      </FormSection>

      <ReminderDateTimeBottomSheet
        ref={bottomSheetRef}
        onConfirm={handleConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  pickerLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  pickerValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pickerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  weekdaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  weekdayButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 12,
    opacity: 0.65,
    marginTop: 10,
  },
});

export default memo(WeeklySchedule);

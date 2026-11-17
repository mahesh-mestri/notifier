
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

import type { ReminderFormValues } from '../../../types/reminder.types';

import ReminderDateTimeBottomSheet, {
  type ReminderDateTimeBottomSheetRef,
  type ReminderPickerField,
} from '../ReminderDateTimeBottomSheet';

type ScheduleField =
  | 'startDate'
  | 'endDate'
  | 'reminderTime';

type Props = {
  value: Pick<ReminderFormValues, ScheduleField>;
  onChange: <K extends ScheduleField>(
    key: K,
    value: ReminderFormValues[K],
  ) => void;
};

function DailySchedule({ value, onChange }: Props) {
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

      <FormSection title="Daily Reminder">
        {renderTimePicker()}

        <Text
          style={[
            styles.helperText,
            { color: colors.text },
          ]}
        >
          Your reminder will repeat every day at this time.
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
  helperText: {
    fontSize: 12,
    opacity: 0.65,
    marginTop: 10,
  },
});

export default memo(DailySchedule);

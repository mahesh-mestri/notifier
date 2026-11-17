
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
  IntervalUnit,
  ReminderFormValues,
} from '../../../types/reminder.types';

import ReminderDateTimeBottomSheet, {
  type ReminderDateTimeBottomSheetRef,
  type ReminderPickerField,
} from '../ReminderDateTimeBottomSheet';

type ScheduleField =
  | 'startDate'
  | 'endDate'
  | 'intervalValue'
  | 'intervalUnit'
  | 'windowStartTime'
  | 'windowEndTime';

type Props = {
  value: Pick<ReminderFormValues, ScheduleField>;
  onChange: <K extends ScheduleField>(
    key: K,
    value: ReminderFormValues[K],
  ) => void;
};

function IntervalSchedule({ value, onChange }: Props) {
  const { colors } = useTheme();

  const bottomSheetRef =
    useRef<ReminderDateTimeBottomSheetRef>(null);

  const handleOpenPicker = (field: ReminderPickerField) => {
    const pickerValues: Partial<
      Record<ReminderPickerField, Date>
    > = {
      start: value.startDate,
      end: value.endDate ?? value.startDate,
      windowStart: value.windowStartTime,
      windowEnd: value.windowEndTime,
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

      case 'windowStart':
        onChange('windowStartTime', date);
        break;

      case 'windowEnd':
        onChange('windowEndTime', date);
        break;
    }
  };

  const handleIntervalChange = (increment: number) => {
    const nextValue = Math.max(
      1,
      value.intervalValue + increment,
    );

    onChange('intervalValue', nextValue);
  };

  const handleUnitChange = (unit: IntervalUnit) => {
    onChange('intervalUnit', unit);
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

  const renderTimePicker = (
    label: string,
    field: 'windowStart' | 'windowEnd',
    time: Date,
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
          {format(time, 'hh:mm a')}
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

      <FormSection title="Repeat Frequency">
        <View
          style={[
            styles.intervalContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Pressable
            onPress={() => handleIntervalChange(-1)}
            disabled={value.intervalValue <= 1}
            style={styles.counterButton}
          >
            <MaterialDesignIcons
              name="minus-circle-outline"
              size={26}
              color={
                value.intervalValue <= 1
                  ? colors.border
                  : colors.primary
              }
            />
          </Pressable>

          <View style={styles.intervalValue}>
            <Text
              style={[
                styles.intervalNumber,
                { color: colors.text },
              ]}
            >
              {value.intervalValue}
            </Text>

            <Text
              style={[
                styles.intervalLabel,
                { color: colors.text },
              ]}
            >
              {value.intervalUnit}
            </Text>
          </View>

          <Pressable
            onPress={() => handleIntervalChange(1)}
            style={styles.counterButton}
          >
            <MaterialDesignIcons
              name="plus-circle-outline"
              size={26}
              color={colors.primary}
            />
          </Pressable>
        </View>

        <View style={styles.unitContainer}>
          {(['minutes', 'hours'] as IntervalUnit[]).map(
            unit => {
              const selected = value.intervalUnit === unit;

              return (
                <Pressable
                  key={unit}
                  onPress={() => handleUnitChange(unit)}
                  style={[
                    styles.unitButton,
                    {
                      backgroundColor: selected
                        ? colors.primary
                        : colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: selected
                        ? '#FFFFFF'
                        : colors.text,
                      fontWeight: selected ? '600' : '400',
                    }}
                  >
                    {unit === 'minutes' ? 'Minutes' : 'Hours'}
                  </Text>
                </Pressable>
              );
            },
          )}
        </View>
      </FormSection>

      <FormSection title="Active Time Window">
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            {renderTimePicker(
              'Start Time',
              'windowStart',
              value.windowStartTime,
            )}
          </View>

          <View style={styles.halfWidth}>
            {renderTimePicker(
              'End Time',
              'windowEnd',
              value.windowEndTime,
            )}
          </View>
        </View>
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
  intervalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  counterButton: {
    padding: 4,
  },
  intervalValue: {
    alignItems: 'center',
    gap: 2,
  },
  intervalNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  intervalLabel: {
    fontSize: 13,
    textTransform: 'capitalize',
  },
  unitContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  unitButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
});

export default memo(IntervalSchedule);

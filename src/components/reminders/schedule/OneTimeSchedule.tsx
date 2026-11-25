import React, { memo, useRef } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { format } from 'date-fns';

import { FormSection } from '../../ui/Field';
import type { ReminderFormValues } from '../../../types/reminder.types';
import ReminderDateTimeBottomSheet, {
  type ReminderDateTimeBottomSheetRef,
  type ReminderPickerField,
} from '../ReminderDateTimeBottomSheet';

type ScheduleField = 'startDate' | 'reminderTime';

type Props = {
  value: Pick<ReminderFormValues, ScheduleField>;
  onChange: (key: ScheduleField, value: Date) => void;
};

function OneTimeSchedule({ value, onChange }: Props) {
  const { colors } = useTheme();
  const ref = useRef<ReminderDateTimeBottomSheetRef>(null);

  const handleOpenPicker = (field: ReminderPickerField) => {
    ref.current?.open({
      field,
      value: field === 'start' ? value.startDate : new Date(),
    });
  };

  const handleConfirm = (field: ReminderPickerField, date: Date) => {
    switch (field) {
      case 'start':
        onChange('startDate', date);
        break;

      case 'time':
        onChange('reminderTime', date);
        break;
    }
  };

  return (
    <View style={styles.row}>
      <FormSection title="Reminder Date" style={styles.w48}>
        <Pressable
          onPress={() => handleOpenPicker('start')}
          style={[
            styles.picker,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <MaterialDesignIcons
            name="calendar"
            size={22}
            color={colors.primary}
          />

          <Text style={[styles.m6, { color: colors.text }]}>
            {format(value.startDate, 'dd MMM yyyy')}
          </Text>
        </Pressable>
      </FormSection>

      <FormSection title="Reminder Time" style={styles.w48}>
        <Pressable
          onPress={() => handleOpenPicker('time')}
          style={[
            styles.picker,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <MaterialDesignIcons
            name="clock-outline"
            size={22}
            color={colors.primary}
          />

          <Text style={[styles.m6, { color: colors.text }]}>
            {format(value.reminderTime, 'hh:mm a')}
          </Text>
        </Pressable>
      </FormSection>

      <ReminderDateTimeBottomSheet
        ref={ref}
        onConfirm={handleConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  picker: {
    minHeight: 54,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  w48: {
    width: '48%',
  },
  m6: {
    marginLeft: 6,
  },
});

export default memo(OneTimeSchedule);
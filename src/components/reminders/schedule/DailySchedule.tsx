
import React, { memo } from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { format } from 'date-fns';

import { FormSection } from '../../ui/Field';
import type { ReminderFormValues } from '../../../types/reminder.types';

type Props = {
  value: Pick<ReminderFormValues, 'startDate' | 'endDate' | 'reminderTime'>;
  onPickDate: (target: 'start' | 'end' | 'reminderTime') => void;
};

function DailySchedule({ value, onPickDate }: Props) {
  const { colors } = useTheme();

  const renderPicker = (title: string, date: Date | null, target: 'start' | 'end' | 'reminderTime', time = false) => (
    <FormSection title={title}>
      <Pressable
        onPress={() => onPickDate(target)}
        style={[styles.picker, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <MaterialDesignIcons
          name={time ? 'clock-outline' : 'calendar'}
          size={21}
          color={colors.primary}
        />
        <Text style={{ color: colors.text }}>
          {date ? format(date, time ? 'hh:mm a' : 'dd MMM yyyy') : 'No end date'}
        </Text>
      </Pressable>
    </FormSection>
  );

  return (
    <View>
      {renderPicker('Start Date', value.startDate, 'start')}
      {renderPicker('Reminder Time', value.reminderTime, 'reminderTime', true)}
      {renderPicker('End Date (Optional)', value.endDate, 'end')}
    </View>
  );
}

const styles = StyleSheet.create({
  picker: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});

export default memo(DailySchedule);

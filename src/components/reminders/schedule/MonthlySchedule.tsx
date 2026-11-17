
import React, { memo } from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { format } from 'date-fns';

import { FormSection } from '../../ui/Field';
import type { ReminderFormValues } from '../../../types/reminder.types';

type Props = {
  value: Pick<ReminderFormValues, 'startDate' | 'endDate' | 'reminderTime' | 'dayOfMonth'>;
  onChange: (key: 'dayOfMonth', value: number) => void;
  onPickDate: (target: 'start' | 'end' | 'reminderTime') => void;
};

function MonthlySchedule({ value, onChange, onPickDate }: Props) {
  const { colors } = useTheme();

  return (
    <View>
      <FormSection title="Day of Month">
        <View style={styles.days}>
          {[1, 5, 10, 15, 20, 25, 28, 30, 31].map(day => {
            const selected = value.dayOfMonth === day;

            return (
              <Pressable
                key={day}
                onPress={() => onChange('dayOfMonth', day)}
                style={[
                  styles.day,
                  {
                    backgroundColor: selected ? colors.primary : colors.card,
                    borderColor: selected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={{ color: selected ? '#FFFFFF' : colors.text }}>
                  {day}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </FormSection>

      <FormSection title="Start Date">
        <Pressable onPress={() => onPickDate('start')} style={[styles.picker, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={{ color: colors.text }}>{format(value.startDate, 'dd MMM yyyy')}</Text>
        </Pressable>
      </FormSection>

      <FormSection title="Reminder Time">
        <Pressable onPress={() => onPickDate('reminderTime')} style={[styles.picker, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={{ color: colors.text }}>{format(value.reminderTime, 'hh:mm a')}</Text>
        </Pressable>
      </FormSection>

      <FormSection title="End Date (Optional)">
        <Pressable onPress={() => onPickDate('end')} style={[styles.picker, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={{ color: colors.text }}>
            {value.endDate ? format(value.endDate, 'dd MMM yyyy') : 'No end date'}
          </Text>
        </Pressable>
      </FormSection>
    </View>
  );
}

const styles = StyleSheet.create({
  days: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  day: {
    width: 43,
    height: 43,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
});

export default memo(MonthlySchedule);

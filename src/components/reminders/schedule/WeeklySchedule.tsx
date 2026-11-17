
import React, { memo } from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { format } from 'date-fns';

import { FormSection } from '../../ui/Field';
import type { ReminderFormValues, Weekday } from '../../../types/reminder.types';

type Props = {
  value: Pick<ReminderFormValues, 'startDate' | 'endDate' | 'reminderTime' | 'selectedWeekdays'>;
  onChange: (key: 'selectedWeekdays', value: Weekday[]) => void;
  onPickDate: (target: 'start' | 'end' | 'reminderTime') => void;
};

const DAYS: { label: string; value: Weekday }[] = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
];

function WeeklySchedule({ value, onChange, onPickDate }: Props) {
  const { colors } = useTheme();

  const toggleDay = (day: Weekday) => {
    const selected = value.selectedWeekdays.includes(day);

    onChange(
      'selectedWeekdays',
      selected
        ? value.selectedWeekdays.filter(item => item !== day)
        : [...value.selectedWeekdays, day],
    );
  };

  return (
    <View>
      <FormSection title="Repeat On">
        <View style={styles.days}>
          {DAYS.map(day => {
            const selected = value.selectedWeekdays.includes(day.value);

            return (
              <Pressable
                key={day.value}
                onPress={() => toggleDay(day.value)}
                style={[
                  styles.day,
                  {
                    backgroundColor: selected ? colors.primary : colors.card,
                    borderColor: selected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={{ color: selected ? '#FFFFFF' : colors.text, fontWeight: '600' }}>
                  {day.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </FormSection>

      <FormSection title="Start Date">
        <Pressable onPress={() => onPickDate('start')} style={[styles.picker, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Text style={{ color: colors.text }}>{format(value.startDate, 'dd MMM yyyy')}</Text>
        </Pressable>
      </FormSection>

      <FormSection title="Reminder Time">
        <Pressable onPress={() => onPickDate('reminderTime')} style={[styles.picker, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Text style={{ color: colors.text }}>{format(value.reminderTime, 'hh:mm a')}</Text>
        </Pressable>
      </FormSection>

      <FormSection title="End Date (Optional)">
        <Pressable onPress={() => onPickDate('end')} style={[styles.picker, { borderColor: colors.border, backgroundColor: colors.card }]}>
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
    gap: 8,
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

export default memo(WeeklySchedule);

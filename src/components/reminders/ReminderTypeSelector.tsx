
import React, { memo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';

import type { scheduleType } from '../../types/reminder.types';

interface Props {
  value: scheduleType;
  onChange: (value: scheduleType) => void;
}

const TYPES: {
  label: string;
  description: string;
  value: scheduleType;
  icon: string;
  fullWidth?: boolean;
}[] = [
  {
    label: 'Once',
    description: 'One-time reminder',
    value: 'once',
    icon: 'calendar-check-outline',
  },
  {
    label: 'At intervals',
    description: 'Every few minutes or hours',
    value: 'interval',
    icon: 'repeat',
  },
  {
    label: 'Every day',
    description: 'Daily at a specific time',
    value: 'daily',
    icon: 'weather-sunny',
  },
  {
    label: 'Every week',
    description: 'Choose specific weekdays',
    value: 'weekly',
    icon: 'calendar-week',
  },
  {
    label: 'Every month',
    description: 'Choose a day of the month',
    value: 'monthly',
    icon: 'calendar-month',
    fullWidth: true,
  },
];

function scheduleTypeSelector({ value, onChange }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: colors.text }]}>
        When should this reminder happen?
      </Text>

      <View style={styles.options}>
        {TYPES.map(item => {
          const selected = value === item.value;

          return (
            <Pressable
              key={item.value}
              onPress={() => onChange(item.value)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              style={[
                styles.option,
                item.fullWidth && styles.fullWidth,
                {
                  backgroundColor: selected
                    ? colors.primary + '12'
                    : colors.card,
                  borderColor: selected
                    ? colors.primary
                    : colors.border,
                },
              ]}
            >
              <MaterialDesignIcons
                name={item.icon as any}
                size={24}
                color={selected ? colors.primary : colors.text}
              />

              <View style={styles.details}>
                <Text
                  style={[
                    styles.optionTitle,
                    {
                      color: selected
                        ? colors.primary
                        : colors.text,
                    },
                  ]}
                >
                  {item.label}
                </Text>

                <Text
                  style={[
                    styles.description,
                    { color: colors.text },
                  ]}
                >
                  {item.description}
                </Text>
              </View>

              {selected && (
                <MaterialDesignIcons
                  name="check-circle"
                  size={20}
                  color={colors.primary}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
    marginBottom: 22,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  option: {
    width: '48%',
    minHeight: 88,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  fullWidth: {
    width: '100%',
  },
  details: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  description: {
    fontSize: 11,
    opacity: 0.65,
  },
});

export default memo(scheduleTypeSelector);

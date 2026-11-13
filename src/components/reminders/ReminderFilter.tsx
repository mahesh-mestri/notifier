import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

export type ReminderFilterType =
  | 'Today'
  | 'Upcoming'
  | 'Completed'
  | 'Missed';

interface Props {
  selected: ReminderFilterType;
  onChange: (value: ReminderFilterType) => void;
}

const filters: ReminderFilterType[] = [
  'Today',
  'Upcoming',
  'Completed',
  'Missed',
];

export default function ReminderFilter({ selected, onChange }: Props) {
  const { colors } = useTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {filters.map(filter => {
        const active = selected === filter;

        return (
          <Pressable
            key={filter}
            onPress={() => onChange(filter)}
            style={[
              styles.filter,
              {
                backgroundColor: active ? colors.primary : colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={{
                color: active ? '#FFFFFF' : colors.text,
                fontWeight: '600',
                fontSize: 13,
              }}
            >
              {filter}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filter: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    marginRight: 8,
  },
});
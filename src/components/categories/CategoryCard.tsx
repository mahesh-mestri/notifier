import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';

import { PlatformCard } from '../ui/card';
import type { Category } from '../../types/category.types';

interface Props {
  category: Category;
  reminderCount: number;
  onPress: () => void;
}

export default function CategoryCard({
  category,
  reminderCount,
  onPress,
}: Props) {
  const { colors } = useTheme();

  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      <PlatformCard style={styles.card}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: category.backgroundColor },
          ]}
        >
          <MaterialDesignIcons
            name={category.icon as any}
            size={25}
            color={category.color}
          />
        </View>

        <View style={styles.details}>
          <Text style={[styles.name, { color: colors.text }]}>
            {category.name}
          </Text>

          <Text style={[styles.count, { color: colors.text }]}>
            {reminderCount} reminders
          </Text>
        </View>

        <MaterialDesignIcons
          name="chevron-right"
          size={20}
          color={colors.text}
        />
      </PlatformCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '48%',
  },
  card: {
    minHeight: 135,
    justifyContent: 'space-between',
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    gap: 5,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
  },
  count: {
    fontSize: 12,
    opacity: 0.6,
  },
});
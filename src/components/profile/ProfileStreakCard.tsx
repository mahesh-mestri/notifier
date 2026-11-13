    import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';

import { PlatformCard } from '../ui/card';

type Props = {
  currentStreak: number;
  bestStreak: number;
};

export default function ProfileStreakCard({
  currentStreak,
  bestStreak,
}: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <PlatformCard style={styles.card}>
        <MaterialDesignIcons name="fire" size={27} color="#F97316" />

        <Text style={[styles.value, { color: colors.text }]}>
          {currentStreak} days
        </Text>

        <Text style={[styles.label, { color: colors.text + '99' }]}>
          Current streak
        </Text>
      </PlatformCard>

      <PlatformCard style={styles.card}>
        <MaterialDesignIcons
          name="trophy-outline"
          size={27}
          color="#EAB308"
        />

        <Text style={[styles.value, { color: colors.text }]}>
          {bestStreak} days
        </Text>

        <Text style={[styles.label, { color: colors.text + '99' }]}>
          Best streak
        </Text>
      </PlatformCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    padding: 16,
  },
  value: {
    fontSize: 19,
    fontWeight: '800',
    marginTop: 10,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
});
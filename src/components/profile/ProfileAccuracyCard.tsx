import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';

import { PlatformCard } from '../ui/card';

type Props = {
  accuracy: number;
  period?: string;
};

export default function ProfileAccuracyCard({
  accuracy,
  period = 'Last 30 days',
}: Props) {
  const { colors } = useTheme();

  const safeAccuracy = Math.max(0, Math.min(100, accuracy));

  return (
    <PlatformCard style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.label, { color: colors.text + '99' }]}>
            Reminder accuracy
          </Text>

          <Text style={[styles.value, { color: colors.text }]}>
            {safeAccuracy}%
          </Text>
        </View>

        <View style={styles.iconContainer}>
          <MaterialDesignIcons
            name="target"
            size={28}
            color="#16A34A"
          />
        </View>
      </View>

      <View style={styles.track}>
        <View
          style={[
            styles.progress,
            { width: `${safeAccuracy}%` },
          ]}
        />
      </View>

      <Text style={[styles.caption, { color: colors.text + '99' }]}>
        On-time completion rate · {period}
      </Text>
    </PlatformCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 17,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
  },
  value: {
    fontSize: 34,
    fontWeight: '800',
    marginTop: 5,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#16A34A15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    height: 9,
    backgroundColor: '#80808025',
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 15,
  },
  progress: {
    height: '100%',
    borderRadius: 20,
    backgroundColor: '#16A34A',
  },
  caption: {
    fontSize: 11,
    marginTop: 9,
  },
});
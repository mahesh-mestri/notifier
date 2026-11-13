
import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import { useTheme } from '@react-navigation/native';

function StayOrganized() {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View
        style={[
          styles.illustration,
          { backgroundColor: colors.card },
        ]}
      >
        <Text style={styles.emoji}>🔔</Text>
      </View>

      <Text
        style={[
          styles.title,
          { color: colors.text },
        ]}
      >
        Stay focused and organized.
      </Text>

      <Text
        style={[
          styles.description,
          { color: colors.text, opacity: 0.7 },
        ]}
      >
        Manage your day with timely notifications
        and simple actions.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  illustration: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 14,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 27,
  },
});

export default memo(StayOrganized);

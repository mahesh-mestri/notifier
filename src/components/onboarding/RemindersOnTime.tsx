
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

function RemindersOnTime() {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.illustration,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <Text style={styles.emoji}>🗓️</Text>
      </View>

      <Text variant="headlineMedium" style={styles.title}>
        Reminders at the right time.
      </Text>

      <Text
        variant="bodyLarge"
        style={[
          styles.description,
          { color: theme.colors.onSurfaceVariant },
        ]}
      >
        Set reminders for important moments and let
        Notifier keep you on track.
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
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 14,
  },
  description: {
    textAlign: 'center',
    lineHeight: 27,
  },
});

export default memo(RemindersOnTime);

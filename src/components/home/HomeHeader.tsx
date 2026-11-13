import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function HomeHeader() {
  const { colors } = useTheme();
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 17
        ? 'Good afternoon'
        : 'Good evening';

  const date = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.date, { color: colors.text }]}>
          {date}
        </Text>

        <Text style={[styles.greeting, { color: colors.text }]}>
          {greeting} 👋
        </Text>

        <Text style={[styles.subtitle, { color: colors.text }]}>
          Stay on top of your day.
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open profile"
        style={[styles.avatar, { backgroundColor: colors.card }]}
      >
        <Text style={{ color: colors.primary, fontWeight: '700' }}>
          U
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    gap: 5,
  },
  date: {
    fontSize: 12,
    opacity: 0.65,
    textTransform: 'uppercase',
  },
  greeting: {
    fontSize: 25,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.65,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
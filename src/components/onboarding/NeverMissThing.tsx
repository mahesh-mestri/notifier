
import React, { memo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

function NeverMissThing() {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/onboard/welcome.png')}
        style={styles.illustration}
        resizeMode="contain"
      />

      <Text variant="headlineMedium" style={styles.title}>
        Never miss a thing.
      </Text>

      <Text
        variant="bodyLarge"
        style={[
          styles.description,
          { color: theme.colors.onSurfaceVariant },
        ]}
      >
        Keep your important tasks, plans, and reminders
        organized in one simple place.
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
    width: '100%',
    height: 300,
    marginBottom: 28,
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

export default memo(NeverMissThing);

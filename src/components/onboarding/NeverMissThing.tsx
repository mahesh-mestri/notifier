
import React, { memo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '@react-navigation/native';

function NeverMissThing() {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Image
        source={require('../../assets/onboard/welcome.png')}
        style={styles.illustration}
        resizeMode="contain"
      />

      <Text
        style={[
          styles.title,
          { color: colors.text },
        ]}
      >
        Never miss a thing.
      </Text>

      <Text
        style={[
          styles.description,
          { color: colors.text },
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
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 14,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 27,
    opacity: 0.75,
  },
});

export default memo(NeverMissThing);

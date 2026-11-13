
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';

import {
  useThemePreference,
  type ThemeMode,
} from '../../context/ThemePreferenceContext';

const themeOptions: {
  label: string;
  value: ThemeMode;
  icon: string;
  description: string;
}[] = [
  {
    label: 'System',
    value: 'system',
    icon: 'cellphone',
    description: 'Follow device appearance',
  },
  {
    label: 'Light',
    value: 'light',
    icon: 'white-balance-sunny',
    description: 'Always use light theme',
  },
  {
    label: 'Dark',
    value: 'dark',
    icon: 'moon-waning-crescent',
    description: 'Always use dark theme',
  },
];

export default function ThemeSelector() {
  const { colors } = useTheme();
  const { themeMode, setThemeMode } = useThemePreference();

  return (
    <View style={styles.container}>
      {themeOptions.map((option) => {
        const isSelected = themeMode === option.value;

        return (
          <Pressable
            key={option.value}
            onPress={() => setThemeMode(option.value)}
            style={({ pressed }) => [
              styles.option,
              {
                backgroundColor: isSelected
                  ? colors.primary + '12'
                  : colors.card,
                borderColor: isSelected
                  ? colors.primary
                  : colors.border,
              },
              pressed && styles.pressed,
            ]}
          >
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: isSelected
                    ? colors.primary + '20'
                    : colors.background,
                },
              ]}
            >
              <MaterialDesignIcons
                name={option.icon as any}
                size={21}
                color={isSelected ? colors.primary : colors.text}
              />
            </View>

            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.optionTitle,
                  { color: colors.text },
                ]}
              >
                {option.label}
              </Text>

              <Text
                style={[
                  styles.optionDescription,
                  { color: colors.text, opacity: 0.6 },
                ]}
              >
                {option.description}
              </Text>
            </View>

            <MaterialDesignIcons
              name={
                isSelected
                  ? 'radiobox-marked'
                  : 'radiobox-blank'
              }
              size={22}
              color={isSelected ? colors.primary : colors.border}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textContainer: {
    flex: 1,
  },

  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },

  optionDescription: {
    fontSize: 11,
    marginTop: 4,
  },

  pressed: {
    opacity: 0.7,
  },
});

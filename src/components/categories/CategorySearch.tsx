import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function CategorySearch({ value, onChange }: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <MaterialDesignIcons name="magnify" size={22} color={colors.text} />

      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Search categories..."
        placeholderTextColor={colors.text + '80'}
        style={[styles.input, { color: colors.text }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
});
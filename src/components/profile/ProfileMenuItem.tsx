import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';

type Props = {
  title: string;
  subtitle?: string;
  icon: string;
  onPress: () => void;
  danger?: boolean;
};

export default function ProfileMenuItem({
  title,
  subtitle,
  icon,
  onPress,
  danger = false,
}: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { opacity: pressed ? 0.65 : 1 },
      ]}
    >
      <MaterialDesignIcons
        name={icon as any}
        size={23}
        color={danger ? '#DC2626' : colors.primary}
      />

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: danger ? '#DC2626' : colors.text },
          ]}
        >
          {title}
        </Text>

        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.text + '99' }]}>
            {subtitle}
          </Text>
        )}
      </View>

      {!danger && (
        <MaterialDesignIcons
          name="chevron-right"
          size={22}
          color={colors.text + '80'}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingVertical: 15,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 11,
    marginTop: 4,
  },
});